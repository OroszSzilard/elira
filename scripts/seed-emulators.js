const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize admin with emulator settings
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8088';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';

admin.initializeApp({
  projectId: 'elira-67ab7'
});

const auth = getAuth();
const db = getFirestore();

// Test users data
const testUsers = [
  {
    email: 'admin@elira.hu',
    password: 'Admin123!',
    displayName: 'Admin Felhasználó',
    role: 'admin',
    emailVerified: true
  },
  {
    email: 'instructor@elira.hu',
    password: 'Instructor123!',
    displayName: 'Oktató Felhasználó',
    role: 'instructor',
    emailVerified: true
  },
  {
    email: 'student@elira.hu',
    password: 'Student123!',
    displayName: 'Tanuló Felhasználó',
    role: 'student',
    emailVerified: true
  },
  {
    email: 'university@elira.hu',
    password: 'University123!',
    displayName: 'Egyetemi Admin',
    role: 'UNIVERSITY_ADMIN',
    emailVerified: true,
    universityId: 'university-1'
  }
];

// Test courses data
const testCourses = [
  {
    id: 'course-1',
    title: 'Web Development Alapok',
    description: 'Ismerkedés a modern web fejlesztéssel',
    price: 29900,
    currency: 'HUF',
    instructorId: null, // Will be set after creating instructor
    category: 'development',
    level: 'beginner',
    duration: '10 óra',
    language: 'magyar',
    featured: true,
    published: true,
    thumbnail: 'https://via.placeholder.com/800x450/4F46E5/ffffff?text=Web+Development',
    enrollmentCount: 0,
    rating: 4.5,
    reviewCount: 12,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'course-2',
    title: 'React.js Haladó',
    description: 'Haladó React fejlesztési technikák',
    price: 39900,
    currency: 'HUF',
    instructorId: null, // Will be set after creating instructor
    category: 'development',
    level: 'advanced',
    duration: '15 óra',
    language: 'magyar',
    featured: true,
    published: true,
    thumbnail: 'https://via.placeholder.com/800x450/10B981/ffffff?text=React.js',
    enrollmentCount: 0,
    rating: 4.8,
    reviewCount: 8,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'course-3',
    title: 'Python Programozás',
    description: 'Python alapoktól a haladó szintig',
    price: 34900,
    currency: 'HUF',
    instructorId: null, // Will be set after creating instructor
    category: 'programming',
    level: 'intermediate',
    duration: '20 óra',
    language: 'magyar',
    featured: false,
    published: true,
    thumbnail: 'https://via.placeholder.com/800x450/F59E0B/ffffff?text=Python',
    enrollmentCount: 0,
    rating: 4.6,
    reviewCount: 15,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

// Test lessons for course-1
const testLessons = [
  {
    id: 'lesson-1',
    courseId: 'course-1',
    title: 'Bevezetés a HTML-be',
    description: 'HTML alapok megismerése',
    order: 1,
    duration: '45 perc',
    type: 'video',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    content: 'HTML alapok részletes leírása...',
    published: true
  },
  {
    id: 'lesson-2',
    courseId: 'course-1',
    title: 'CSS Stílusok',
    description: 'CSS alapok és best practices',
    order: 2,
    duration: '60 perc',
    type: 'video',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    content: 'CSS stílusok alkalmazása...',
    published: true
  },
  {
    id: 'lesson-3',
    courseId: 'course-1',
    title: 'JavaScript Alapok',
    description: 'Bevezetés a JavaScript programozásba',
    order: 3,
    duration: '90 perc',
    type: 'video',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    content: 'JavaScript programozás alapjai...',
    published: true
  }
];

// Test university
const testUniversity = {
  id: 'university-1',
  name: 'Budapesti Műszaki Egyetem',
  slug: 'bme',
  description: 'Magyarország vezető műszaki egyeteme',
  logo: 'https://via.placeholder.com/200x200/1E40AF/ffffff?text=BME',
  website: 'https://www.bme.hu',
  contactEmail: 'info@bme.hu',
  settings: {
    allowSelfEnrollment: true,
    requireApproval: false,
    customBranding: true
  },
  departments: ['Informatika', 'Villamosmérnöki', 'Gépészmérnöki'],
  createdAt: admin.firestore.FieldValue.serverTimestamp()
};

async function seedEmulators() {
  console.log('🌱 Starting to seed emulators...\n');

  try {
    // Create university first
    console.log('📚 Creating university...');
    await db.collection('universities').doc(testUniversity.id).set(testUniversity);
    console.log(`✅ University created: ${testUniversity.name}`);

    // Create users
    console.log('\n👥 Creating test users...');
    let instructorId = null;
    
    for (const userData of testUsers) {
      try {
        // Create user in Auth
        const userRecord = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: userData.emailVerified
        });

        // Save instructor ID for courses
        if (userData.role === 'instructor') {
          instructorId = userRecord.uid;
        }

        // Create user document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          universityId: userData.universityId || null,
          emailVerified: userData.emailVerified,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          profileCompleted: true,
          isActive: true
        });

        console.log(`✅ User created: ${userData.email} (${userData.role})`);
      } catch (error) {
        if (error.code === 'auth/email-already-exists') {
          console.log(`⚠️  User already exists: ${userData.email}`);
          
          // Get existing user and update their Firestore document
          try {
            const existingUser = await auth.getUserByEmail(userData.email);
            
            // Update user document in Firestore with new role
            await db.collection('users').doc(existingUser.uid).set({
              email: userData.email,
              displayName: userData.displayName,
              role: userData.role,
              universityId: userData.universityId || null,
              universityName: userData.universityId === 'university-1' ? 'Budapesti Műszaki Egyetem' : null,
              emailVerified: userData.emailVerified,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              profileCompleted: true,
              isActive: true
            }, { merge: true }); // Use merge to preserve existing fields
            
            console.log(`✅ Updated user role in Firestore: ${userData.email} -> ${userData.role}`);
            
            // Save instructor ID for courses
            if (userData.role === 'instructor') {
              instructorId = existingUser.uid;
            }
          } catch (updateError) {
            console.error(`❌ Error updating user ${userData.email}:`, updateError.message);
          }
        } else {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }

    // Create courses with instructor ID
    console.log('\n📚 Creating test courses...');
    for (const course of testCourses) {
      course.instructorId = instructorId;
      await db.collection('courses').doc(course.id).set(course);
      console.log(`✅ Course created: ${course.title}`);
    }

    // Create lessons
    console.log('\n📝 Creating test lessons...');
    for (const lesson of testLessons) {
      await db.collection('courses').doc(lesson.courseId)
        .collection('lessons').doc(lesson.id).set({
          ...lesson,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      console.log(`✅ Lesson created: ${lesson.title}`);
    }

    // Create some enrollments
    console.log('\n📝 Creating test enrollments...');
    const studentUser = await auth.getUserByEmail('student@elira.hu');
    
    await db.collection('enrollments').doc(`${studentUser.uid}_course-1`).set({
      userId: studentUser.uid,
      courseId: 'course-1',
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
      progress: 33,
      completedLessons: ['lesson-1'],
      lastAccessedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    });
    console.log('✅ Enrollment created for student@elira.hu in Web Development Alapok');

    console.log('\n✨ Seeding completed successfully!');
    console.log('\n📋 Test credentials:');
    console.log('─────────────────────────────────────');
    testUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seeding
seedEmulators();