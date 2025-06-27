const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const visitRoutes = require('./routes/visit.routes');

require('dotenv').config({ path: './.env' });

const app = express();

// Body parser middleware
app.use(express.json());

// Session and Passport Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// DB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  });

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/visits', visitRoutes);

// Vercel will handle the port
module.exports = app; 