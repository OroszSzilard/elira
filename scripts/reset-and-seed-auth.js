// reset-and-seed-auth.js - Reset and create test users in Firebase Auth emulator
const admin = require('firebase-admin');

// Initialize Firebase Admin for emulator
const app = admin.initializeApp({
  projectId: 'elira-67ab7',
});

// Connect to emulator
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9098';

async function deleteAllUsers() {
  const auth = admin.auth(app);
  
  try {
    const listUsersResult = await auth.listUsers(1000);
    const users = listUsersResult.users;
    
    if (users.length === 0) {
      console.log('No users to delete');
      return;
    }
    
    console.log(`🗑️  Deleting ${users.length} existing users...`);
    const deletePromises = users.map(user => auth.deleteUser(user.uid));
    await Promise.all(deletePromises);
    console.log('✅ All users deleted');
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}

async function createTestUsers() {
  const auth = admin.auth(app);
  
  const testUsers = [
    {
      email: 'admin@elira.hu',
      password: 'admin123',
      displayName: 'Admin User',
      customClaims: { role: 'admin' }
    },
    {
      email: 'nagypeter@elira.hu',
      password: 'instructor123',
      displayName: 'Nagy Péter',
      customClaims: { role: 'instructor' }
    },
    {
      email: 'kovacsjanos@elira.hu',
      password: 'student123',
      displayName: 'Kovács János',
      customClaims: { role: 'student' }
    },
    {
      email: 'szaboanna@elira.hu',
      password: 'student123',
      displayName: 'Szabó Anna',
      customClaims: { role: 'student' }
    }
  ];

  console.log('🚀 Creating test users in Firebase Auth emulator...\n');

  for (const user of testUsers) {
    try {
      // Create the user
      const userRecord = await auth.createUser({
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
}

async function main() {
  console.log('🔧 Resetting Firebase Auth emulator...\n');
  await deleteAllUsers();
  await createTestUsers();
  process.exit(0);
}

// Run the main function
main().catch(console.error);