const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://otmsdb:admin@otms.qxyafhq.mongodb.net/";

const client = new MongoClient(uri);
client.connect();
const db = client.db("s13");
const col = db.collection("courses"); // Changed collection name to "courses"

app.post('/insert',(request,response) => {
  response.send('YOUR EXPRESS BACKEND IS CONNECTED TO REACT');
  console.log(request.body)
  col.insertOne(request.body)
  console.log("Documents Inserted");
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await col.findOne({ email, password });

    if (user) {
      // If user exists and credentials match, send a success response
      res.status(200).json({ message: 'Login successful', user });
    } else {
      // If user does not exist or credentials do not match, send an error response
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // If an error occurs during the database operation, send an internal server error response
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

mongoose.connect(uri + 's13', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

app.post('/enroll', async (req, res) => {
  const { courseId, courseName } = req.body;

  // Check if courseId and courseName are provided
  if (!courseId || !courseName) {
      return res.status(400).send('Course ID and name are required');
  }

  try {
      // Check if the course is already enrolled
      const existingEnrollment = await col.findOne({ courseId });

      if (existingEnrollment) {
          // Course is already enrolled, so remove it
          await col.deleteOne({ courseId });
          console.log("Course unenrolled successfully");
          res.send('Course unenrolled successfully');
      } else {
          // Course is not enrolled, so enroll it
          const enrollmentData = {
              courseId,
              courseName,
              enrollmentDate: new Date() // You can add additional enrollment data if needed
          };

          // Insert enrollment data into the database
          await col.insertOne(enrollmentData);
          console.log("Course enrolled successfully");
          res.send('Course enrolled successfully');
      }
  } catch (error) {
      console.error("Error enrolling/unenrolling in course:", error);
      res.status(500).send('Error enrolling/unenrolling in course');
  }
});

// New endpoint to fetch courses for timetable
app.get('/timetable', async (req, res) => {
    try {
        const courses = await col.find().toArray();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses for timetable:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(8081);
console.log("server started");
