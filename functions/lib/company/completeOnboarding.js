"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeCompanyOnboarding = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const v2_1 = require("firebase-functions/v2");
const https_1 = require("firebase-functions/v2/https");
/**
 * Complete company onboarding - creates company, sets up admin, and invites employees
 * Called after Firebase Auth account creation
 */
exports.completeCompanyOnboarding = v2_1.https.onCall({
    region: 'us-central1',
    memory: '512MiB',
    cors: true
}, async (request) => {
    const db = admin.firestore();
    const auth = admin.auth();
    // Verify authentication
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const userId = request.auth.uid;
    const { companyName, billingEmail, industry, companySize, employees } = request.data;
    // Validate required fields
    if (!companyName?.trim()) {
        throw new https_1.HttpsError('invalid-argument', 'Company name is required');
    }
    if (!billingEmail?.trim()) {
        throw new https_1.HttpsError('invalid-argument', 'Billing email is required');
    }
    if (!industry) {
        throw new https_1.HttpsError('invalid-argument', 'Industry is required');
    }
    if (!companySize) {
        throw new https_1.HttpsError('invalid-argument', 'Company size is required');
    }
    try {
        // Generate company slug from name
        const slug = companyName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();
        // Check if slug already exists
        const existingCompanyQuery = await db
            .collection('companies')
            .where('slug', '==', slug)
            .limit(1)
            .get();
        let finalSlug = slug;
        if (!existingCompanyQuery.empty) {
            // Append timestamp to make unique
            finalSlug = `${slug}-${Date.now()}`;
        }
        // Step 1: Create company document
        const companyData = {
            name: companyName.trim(),
            slug: finalSlug,
            billingEmail: billingEmail.trim().toLowerCase(),
            plan: 'trial',
            status: 'active',
            industry,
            companySize,
            trialEndsAt: firestore_1.Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
            ),
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        };
        const companyRef = await db.collection('companies').add(companyData);
        const companyId = companyRef.id;
        // Get user details from Firebase Auth
        const userRecord = await auth.getUser(userId);
        const userEmail = userRecord.email || '';
        const userName = userRecord.displayName || '';
        // Step 2: Create company admin document
        const adminData = {
            userId,
            companyId,
            email: userEmail,
            name: userName,
            role: 'owner',
            permissions: {
                canManageEmployees: true,
                canViewReports: true,
                canManageBilling: true,
                canManageMasterclasses: true,
            },
            status: 'active',
            addedBy: userId,
            addedAt: firestore_1.FieldValue.serverTimestamp(),
        };
        await db
            .collection('companies')
            .doc(companyId)
            .collection('admins')
            .doc(userId)
            .set(adminData);
        // Step 3: Create user document in users collection
        const nameParts = userName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        await db.collection('users').doc(userId).set({
            id: userId,
            email: userEmail,
            firstName: firstName,
            lastName: lastName,
            role: 'COMPANY_ADMIN',
            companyId: companyId,
            companyRole: 'owner',
            profilePictureUrl: null,
            title: 'Company Owner',
            bio: `Owner of ${companyName}`,
            institution: companyName,
            credentials: [],
            specialties: [],
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        // Step 4: Set custom claims for the owner
        await auth.setCustomUserClaims(userId, {
            role: 'COMPANY_ADMIN',
            companyId: companyId,
            companyRole: 'owner',
        });
        // Step 5: Invite employees (if any)
        let employeesInvited = 0;
        if (employees && employees.length > 0) {
            const batch = db.batch();
            for (const employee of employees) {
                // Validate employee data
                if (!employee.firstName?.trim() || !employee.lastName?.trim()) {
                    continue; // Skip invalid entries
                }
                if (!employee.email?.trim()) {
                    continue; // Skip invalid entries
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(employee.email)) {
                    continue; // Skip invalid emails
                }
                // Generate invitation token
                const inviteToken = `invite-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                // Create employee document
                const employeeData = {
                    firstName: employee.firstName.trim(),
                    lastName: employee.lastName.trim(),
                    email: employee.email.trim().toLowerCase(),
                    jobTitle: employee.jobTitle?.trim() || '',
                    status: 'invited',
                    inviteToken,
                    inviteExpiresAt: firestore_1.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days to accept
                    ),
                    companyId,
                    invitedBy: userId,
                    invitedAt: firestore_1.FieldValue.serverTimestamp(),
                };
                const employeeRef = db
                    .collection('companies')
                    .doc(companyId)
                    .collection('employees')
                    .doc();
                batch.set(employeeRef, employeeData);
                employeesInvited++;
                // TODO: Send invitation email
                // In production, you would send an email here with the invite link
                console.log(`Invitation sent to ${employee.email} with token: ${inviteToken}`);
            }
            await batch.commit();
        }
        console.log(`✅ Company onboarding completed for ${companyName} (${companyId})`);
        console.log(`   Owner: ${userId}`);
        console.log(`   Employees invited: ${employeesInvited}`);
        return {
            success: true,
            companyId,
            employeesInvited,
        };
    }
    catch (error) {
        console.error('Error in completeCompanyOnboarding:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', `Failed to complete onboarding: ${error.message}`);
    }
});
//# sourceMappingURL=completeOnboarding.js.map