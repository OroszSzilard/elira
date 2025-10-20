const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Set Firestore to use emulator
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8088';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

// Initialize Firebase Admin only if not already initialized
if (getApps().length === 0) {
  initializeApp({
    projectId: 'elira-67ab7',
  });
}

const db = getFirestore();
const auth = getAuth();

// Test data
const testCategories = [
  {
    name: 'Webfejlesztés',
    description: 'Modern webalkalmazások fejlesztése és karbantartása',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Digitális Marketing',
    description: 'Online marketing stratégiák és eszközök',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'AI és Gépi Tanulás',
    description: 'Mesterséges intelligencia és gépi tanulás alapjai',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Adatelemzés',
    description: 'Adatok elemzése és vizualizálása',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Mobilfejlesztés',
    description: 'iOS és Android alkalmazások fejlesztése',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const testUniversities = [
  {
    name: 'Budapesti Műszaki és Gazdaságtudományi Egyetem',
    description: 'Magyarország vezető műszaki egyeteme',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Eötvös Loránd Tudományegyetem',
    description: 'Magyarország legnagyobb egyeteme',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Corvinus Egyetem',
    description: 'Gazdaságtudományi és társadalomtudományi képzés',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const testCourses = [
  {
    title: 'React.js Alapok',
    description: 'Modern webalkalmazások fejlesztése React.js-szel. Megtanulod a komponens-alapú fejlesztést, a state kezelést és a legfrissebb React hook-okat.',
    priceHUF: 29900,
    duration: '8 óra',
    difficulty: 'BEGINNER',
    language: 'hu',
    status: 'PUBLISHED',
    isPlus: false,
    certificateEnabled: true,
    instructorId: 'dev-admin-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    averageRating: 4.5,
    ratingCount: 23,
    modules: [
      {
        id: 'module-1',
        title: 'Bevezető',
        order: 1,
        status: 'PUBLISHED',
        lessons: [
          {
            id: 'lesson-1',
            slug: 'bevezeto-lecke',
            title: 'Bevezető lecke',
            content: '',
            type: 'VIDEO',
            order: 1,
            status: 'PUBLISHED',
            videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    ],
  },
  {
    title: 'Python Adatelemzés',
    description: 'Adatelemzés Python-ban pandas, numpy és matplotlib használatával. Valós adatokkal dolgozunk és megtanuljuk az adatok vizualizálását.',
    priceHUF: 39900,
    duration: '12 óra',
    difficulty: 'INTERMEDIATE',
    language: 'hu',
    status: 'PUBLISHED',
    isPlus: true,
    certificateEnabled: true,
    instructorId: 'dev-admin-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    averageRating: 4.2,
    ratingCount: 18,
    modules: [
      {
        id: 'module-2',
        title: 'Első modul',
        order: 1,
        status: 'PUBLISHED',
        lessons: [
          {
            id: 'lesson-2',
            slug: 'elso-lecke',
            title: 'Első lecke',
            content: '',
            type: 'VIDEO',
            order: 1,
            status: 'PUBLISHED',
            videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    ],
  },
  {
    title: 'Digitális Marketing Alapok',
    description: 'A digitális marketing világának bemutatása. Megtanuljuk a SEO, PPC, közösségi média marketing és email marketing alapjait.',
    priceHUF: 24900,
    duration: '6 óra',
    difficulty: 'BEGINNER',
    language: 'hu',
    status: 'PUBLISHED',
    isPlus: false,
    certificateEnabled: true,
    instructorId: 'dev-admin-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    averageRating: 4.7,
    ratingCount: 31,
    modules: [
      {
        id: 'module-3',
        title: 'Első modul',
        order: 1,
        status: 'PUBLISHED',
        lessons: [
          {
            id: 'lesson-3',
            slug: 'digitalis-marketing-bevezeto',
            title: 'Első lecke',
            content: '',
            type: 'VIDEO',
            order: 1,
            status: 'PUBLISHED',
            videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    ],
  },
  {
    title: 'Machine Learning Alapok',
    description: 'Gépi tanulás alapelvei és gyakorlati alkalmazások. Megtanuljuk a különböző algoritmusokat és valós problémákat oldunk meg.',
    priceHUF: 49900,
    duration: '15 óra',
    difficulty: 'ADVANCED',
    language: 'hu',
    status: 'PUBLISHED',
    isPlus: true,
    certificateEnabled: true,
    instructorId: 'dev-admin-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    averageRating: 4.8,
    ratingCount: 45,
    modules: [
      {
        id: 'module-4',
        title: 'Első modul',
        order: 1,
        status: 'PUBLISHED',
        lessons: [
          {
            id: 'lesson-4',
            slug: 'ml-alapok',
            title: 'Első lecke',
            content: '',
            type: 'VIDEO',
            order: 1,
            status: 'PUBLISHED',
            videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    ],
  },
  {
    title: 'iOS Fejlesztés Swift-tel',
    description: 'iPhone és iPad alkalmazások fejlesztése Swift programozási nyelvvel. Megtanuljuk az iOS SDK használatát és az App Store-ra való feltöltést.',
    priceHUF: 44900,
    duration: '10 óra',
    difficulty: 'INTERMEDIATE',
    language: 'hu',
    status: 'PUBLISHED',
    isPlus: true,
    certificateEnabled: true,
    instructorId: 'dev-admin-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    averageRating: 4.6,
    ratingCount: 27,
    modules: [
      {
        id: 'module-5',
        title: 'Első modul',
        order: 1,
        status: 'PUBLISHED',
        lessons: [
          {
            id: 'lesson-5',
            slug: 'ios-bevezeto',
            title: 'Első lecke',
            content: '',
            type: 'VIDEO',
            order: 1,
            status: 'PUBLISHED',
            videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    ],
  },
];



const testUsers = [
  {
    id: 'WUGJfyeG6pvuojUwWtnNHUpMC3un',
    email: 'admin@elira.hu',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    profilePictureUrl: null,
    title: 'System Administrator',
    bio: 'System administrator for Elira platform',
    companyRole: 'Admin',
    institution: 'Elira',
    credentials: ['System Admin'],
    specialties: ['Platform Management'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'jjCWRvVCERVBO4YWBlhxu3ynnyGx',
    email: 'nagypeter@elira.hu',
    firstName: 'Nagy',
    lastName: 'Péter',
    role: 'INSTRUCTOR',
    profilePictureUrl: null,
    title: 'Senior Software Engineer',
    bio: 'Több mint 10 éves tapasztalattal rendelkező szoftverfejlesztő és oktató',
    companyRole: 'Lead Developer',
    institution: 'Tech Solutions Kft.',
    credentials: ['MSc Computer Science', 'Google Cloud Certified'],
    specialties: ['React', 'Node.js', 'Cloud Architecture'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rvrvcbhX8NqV7bghm4umhfGuGuyo',
    email: 'kovacsjanos@elira.hu',
    firstName: 'Kovács',
    lastName: 'János',
    role: 'STUDENT',
    profilePictureUrl: null,
    title: 'Junior Developer',
    bio: 'Lelkes junior fejlesztő, aki szeretne tanulni',
    companyRole: 'Junior Developer',
    institution: 'StartUp Kft.',
    credentials: [],
    specialties: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8P3Kanza5Cak6esWIaehrCMigEJ1',
    email: 'szaboanna@elira.hu',
    firstName: 'Szabó',
    lastName: 'Anna',
    role: 'STUDENT',
    profilePictureUrl: null,
    title: 'Marketing Manager',
    bio: 'Marketing szakember, aki szeretne digitális készségeket tanulni',
    companyRole: 'Marketing Manager',
    institution: 'Marketing Agency',
    credentials: [],
    specialties: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    
    const usersSnapshot = await db.collection('users').get();
    const userBatch = db.batch();
    usersSnapshot.docs.forEach(doc => {
      userBatch.delete(doc.ref);
    });
    await userBatch.commit();

    const categoriesSnapshot = await db.collection('categories').get();
    const categoryBatch = db.batch();
    categoriesSnapshot.docs.forEach(doc => {
      categoryBatch.delete(doc.ref);
    });
    await categoryBatch.commit();

    const universitiesSnapshot = await db.collection('universities').get();
    const universityBatch = db.batch();
    universitiesSnapshot.docs.forEach(doc => {
      universityBatch.delete(doc.ref);
    });
    await universityBatch.commit();

    const coursesSnapshot = await db.collection('courses').get();
    const courseBatch = db.batch();
    coursesSnapshot.docs.forEach(doc => {
      courseBatch.delete(doc.ref);
    });
    await courseBatch.commit();



    console.log('✅ Existing data cleared');
    
    // Create users in Firestore (Auth users already exist from seed-auth.js)
    console.log('👥 Creating/updating users in Firestore...');
    for (const user of testUsers) {
      await db.collection('users').doc(user.id).set(user);
    }
    console.log(`✅ Created/updated ${testUsers.length} users in Firestore`);

    // Create categories
    console.log('📚 Creating categories...');
    const categoryRefs = [];
    for (const category of testCategories) {
      const docRef = db.collection('categories').doc();
      categoryRefs.push(docRef);
      await docRef.set(category);
    }
    console.log(`✅ Created ${testCategories.length} categories`);

    // Create universities
    console.log('🏛️ Creating universities...');
    const universityRefs = [];
    for (const university of testUniversities) {
      const docRef = db.collection('universities').doc();
      universityRefs.push(docRef);
      await docRef.set(university);
    }
    console.log(`✅ Created ${testUniversities.length} universities`);

    // Create courses with proper references
    console.log('📖 Creating courses...');
    const courseRefs = [];
    for (let i = 0; i < testCourses.length; i++) {
      const course = { ...testCourses[i] };
      
      // Extract modules from course data before saving
      const modules = course.modules || [];
      delete course.modules;
      
      // Assign category (cycle through categories)
      course.categoryId = categoryRefs[i % categoryRefs.length].id;
      
      // Assign university (cycle through universities)
      course.universityId = universityRefs[i % universityRefs.length].id;
      
      const courseRef = await db.collection('courses').add(course);
      courseRefs.push(courseRef);
      
      // Create modules as subcollections
      if (modules.length > 0) {
        console.log(`📚 Creating ${modules.length} modules for course ${courseRef.id}`);
        for (const module of modules) {
          const moduleData = { ...module };
          const lessons = moduleData.lessons || [];
          delete moduleData.lessons;
          
          const moduleRef = await db
            .collection(`courses/${courseRef.id}/modules`)
            .add(moduleData);
          
          // Create lessons as subcollections
          if (lessons.length > 0) {
            console.log(`📝 Creating ${lessons.length} lessons for module ${moduleRef.id}`);
            for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex++) {
              const lesson = lessons[lessonIndex];
              // Use fixed ID like lesson-1, lesson-2, etc.
              const lessonId = `lesson-${lessonIndex + 1}`;
              const { id, ...lessonData } = lesson;
              await db
                .collection(`courses/${courseRef.id}/modules/${moduleRef.id}/lessons`)
                .doc(lessonId)
                .set(lessonData);
            }
          }
        }
      }
    }
    console.log(`✅ Created ${testCourses.length} courses with modules and lessons`);



    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ seedDatabase error:', error);
  }
}

seedDatabase(); 