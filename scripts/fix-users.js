const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccountPath = path.join(__dirname, '../../secure/elira-67ab7-firebase-adminsdk.json');
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'elira-67ab7'
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    admin.initializeApp({
      projectId: 'elira-67ab7'
    });
  }
}

const auth = admin.auth();
const db = admin.firestore();

async function listAndFixUsers() {
  console.log('📋 Listing all Firebase Auth users and checking Firestore documents...\n');
  console.log('='.repeat(80));
  
  try {
    // Get all users from Auth
    const listUsersResult = await auth.listUsers(1000);
    console.log(`Found ${listUsersResult.users.length} users in Firebase Auth\n`);
    
    let fixedCount = 0;
    let adminFound = false;
    
    for (const userRecord of listUsersResult.users) {
      console.log(`\n👤 User: ${userRecord.email || 'No email'}`);
      console.log(`   UID: ${userRecord.uid}`);
      console.log(`   Display Name: ${userRecord.displayName || 'Not set'}`);
      console.log(`   Email Verified: ${userRecord.emailVerified}`);
      console.log(`   Custom Claims: ${JSON.stringify(userRecord.customClaims || {})}`);
      
      // Check if user exists in Firestore
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      
      if (!userDoc.exists) {
        console.log(`   ⚠️  MISSING in Firestore - Creating document...`);
        
        // Parse display name for first/last name
        const displayParts = (userRecord.displayName || '').split(' ');
        const firstName = displayParts[0] || 'Unknown';
        const lastName = displayParts.slice(1).join(' ') || 'User';
        
        // Determine role from custom claims or email
        let role = 'STUDENT';
        if (userRecord.customClaims?.role) {
          role = userRecord.customClaims.role;
        } else if (userRecord.email?.includes('admin')) {
          role = 'ADMIN';
        } else if (userRecord.email?.includes('instructor')) {
          role = 'INSTRUCTOR';
        }
        
        // Create Firestore document
        const userData = {
          id: userRecord.uid,
          uid: userRecord.uid,
          email: userRecord.email || '',
          firstName: firstName,
          lastName: lastName,
          displayName: userRecord.displayName || `${firstName} ${lastName}`,
          role: role,
          profilePictureUrl: userRecord.photoURL || null,
          bio: null,
          title: null,
          institution: null,
          emailVerified: userRecord.emailVerified,
          createdAt: new Date(userRecord.metadata.creationTime).toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await db.collection('users').doc(userRecord.uid).set(userData);
        console.log(`   ✅ Created Firestore document with role: ${role}`);
        fixedCount++;
      } else {
        console.log(`   ✅ EXISTS in Firestore`);
        const data = userDoc.data();
        console.log(`   Role in Firestore: ${data.role}`);
      }
      
      // Check for admin user
      if (userRecord.email === 'admin@elira.hu') {
        adminFound = true;
        console.log(`   🔑 ADMIN USER FOUND!`);
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 Summary:`);
    console.log(`   Total users: ${listUsersResult.users.length}`);
    console.log(`   Fixed/Created documents: ${fixedCount}`);
    console.log(`   Admin user found: ${adminFound ? 'YES ✅' : 'NO ❌'}`);
    
    if (!adminFound) {
      console.log('\n⚠️  Admin user not found. Creating admin@elira.hu...');
      
      // Create admin user
      const adminUser = await auth.createUser({
        email: 'admin@elira.hu',
        password: 'admin123',
        displayName: 'Admin User',
        emailVerified: true
      });
      
      // Set custom claims
      await auth.setCustomUserClaims(adminUser.uid, { role: 'ADMIN' });
      
      // Create Firestore document
      await db.collection('users').doc(adminUser.uid).set({
        id: adminUser.uid,
        uid: adminUser.uid,
        email: 'admin@elira.hu',
        firstName: 'Admin',
        lastName: 'User',
        displayName: 'Admin User',
        role: 'ADMIN',
        profilePictureUrl: null,
        bio: 'Platform Administrator',
        title: 'System Administrator',
        institution: 'ELIRA Platform',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('   Email: admin@elira.hu');
      console.log('   Password: admin123');
      console.log('   UID:', adminUser.uid);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n🔗 Firebase Console Links:');
    console.log('   Authentication: https://console.firebase.google.com/project/elira-67ab7/authentication/users');
    console.log('   Firestore Users: https://console.firebase.google.com/project/elira-67ab7/firestore/data/~2Fusers');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

listAndFixUsers();