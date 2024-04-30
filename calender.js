// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/calendar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define event schema and model
const eventSchema = new mongoose.Schema({
  title: String,
  start: Date,
  end: Date
});
const Event = mongoose.model('Event', eventSchema);

// Middleware
app.use(bodyParser.json());

// Add event endpoint
app.post('/api/events', async (req, res) => {
  const { title, start, end } = req.body;

  try {
    const event = new Event({ title, start, end });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding event');
  }
});

// Get all events endpoint
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find({}, '_id title start end').lean();
    res.json(events.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    })));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving events');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
