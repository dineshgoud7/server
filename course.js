const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://otmsdb:admin@otms.qxyafhq.mongodb.net/s13', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a mongoose schema
const CourseSchema = new mongoose.Schema({
  courseId: String,
  courseName: String
});

// Define a mongoose model based on the schema
const Course = mongoose.model('Course', CourseSchema);

// Route to fetch courses
app.get('/api/courses', async (req, res) => {
    try {
      const courses = await Course.find();
      console.log('Courses:', courses); // Log courses to see what's being returned
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  
  

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
