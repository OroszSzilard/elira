const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize admin with emulator settings
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8088';

admin.initializeApp({
  projectId: 'elira-67ab7'
});

const db = getFirestore();

async function checkLesson() {
  const courseId = '4qBmLG0YVXP3ZlIERQji';
  const lessonId = 'lesson-1';
  
  console.log(`📚 Checking lesson: ${lessonId} in course: ${courseId}\n`);

  try {
    // Get the course first
    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (courseDoc.exists) {
      const courseData = courseDoc.data();
      console.log('Course found:', courseData.title);
      console.log('Course lesson count:', courseData.lessonCount);
    }
    
    // Get the specific lesson
    const lessonDoc = await db.collection('courses').doc(courseId)
      .collection('lessons').doc(lessonId).get();
    
    if (lessonDoc.exists) {
      const lessonData = lessonDoc.data();
      console.log('\n✅ Lesson found!');
      console.log('================================');
      console.log('ID:', lessonDoc.id);
      console.log('Title:', lessonData.title);
      console.log('Description:', lessonData.description);
      console.log('Type:', lessonData.type);
      console.log('Order:', lessonData.order);
      console.log('Duration:', lessonData.duration);
      console.log('Published:', lessonData.published);
      console.log('Video URL:', lessonData.videoUrl);
      console.log('Content (first 200 chars):', lessonData.content?.substring(0, 200));
      console.log('Has resources:', !!lessonData.resources);
      console.log('Created at:', lessonData.createdAt);
      console.log('Updated at:', lessonData.updatedAt);
      console.log('\nFull lesson data:');
      console.log(JSON.stringify(lessonData, null, 2));
    } else {
      console.log('❌ Lesson not found!');
    }
    
    // Check all lessons in the course
    console.log('\n📋 All lessons in this course:');
    const allLessons = await db.collection('courses').doc(courseId)
      .collection('lessons').get();
    
    allLessons.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${doc.id}: ${data.title} (${data.type})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
}

checkLesson();