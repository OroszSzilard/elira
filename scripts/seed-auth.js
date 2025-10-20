// seed-auth.js - Create test users in Firebase Auth emulator
const admin = require('firebase-admin');

// Initialize Firebase Admin for emulator
const app = admin.initializeApp({
  projectId: 'elira-67ab7',
});

// Connect to emulator
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

async function createTestUsers() {
  const auth = admin.auth(app);
  
  // Define test users with their specific UIDs to match Firestore data
  const testUsers = [
    {
      uid: 'WUGJfyeG6pvuojUwWtnNHUpMC3un',
      email: 'admin@elira.hu',
      password: 'admin123',
      displayName: 'Admin User',
      customClaims: { role: 'admin' }
    },
    {
      uid: 'jjCWRvVCERVBO4YWBlhxu3ynnyGx',
      email: 'nagypeter@elira.hu',
      password: 'instructor123',
      displayName: 'Nagy Péter',
      customClaims: { role: 'instructor' }
    },
    {
      uid: 'rvrvcbhX8NqV7bghm4umhfGuGuyo',
      email: 'kovacsjanos@elira.hu',
      password: 'student123',
      displayName: 'Kovács János',
      customClaims: { role: 'student' }
    },
    {
      uid: '8P3Kanza5Cak6esWIaehrCMigEJ1',
      email: 'szaboanna@elira.hu',
      password: 'student123',
      displayName: 'Szabó Anna',
      customClaims: { role: 'student' }
    }
  ];

  console.log('🚀 Creating test users in Firebase Auth emulator...\n');

  for (const user of testUsers) {
    try {
      // Check if user already exists and delete if they do
      try {
        const existingUser = await auth.getUserByEmail(user.email);
        console.log(`⚠️  User ${user.email} already exists, deleting...`);
        await auth.deleteUser(existingUser.uid);
      } catch (error) {
        // User doesn't exist, we can create it
      }

      // Create the user with specific UID
      const userRecord = await auth.createUser({
        uid: user.uid,
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true
      });

      // Set custom claims
      if (user.customClaims) {
        await auth.setCustomUserClaims(userRecord.uid, user.customClaims);
      }

      console.log(`✅ Created user: ${user.email} (${user.displayName})`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Role: ${user.customClaims?.role || 'student'}`);
      console.log(`   UID: ${userRecord.uid}\n`);
      
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error.message);
    }
  }

  console.log('\n📝 Test accounts summary:');
  console.log('========================');
  console.log('Admin:      admin@elira.hu / admin123');
  console.log('Instructor: nagypeter@elira.hu / instructor123');
  console.log('Student 1:  kovacsjanos@elira.hu / student123');
  console.log('Student 2:  szaboanna@elira.hu / student123');
  console.log('\n✨ Done! You can now login with these accounts.');
  
  process.exit(0);
}

// Run the seed function
createTestUsers().catch(console.error);