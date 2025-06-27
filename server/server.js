const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const visitRoutes = require('./routes/visit.routes');

require('dotenv').config({ path: './.env' });

const app = express();

// Explicitly handle OPTIONS requests
// This is a robust way to ensure preflight requests are handled correctly.
app.options('*', cors()); 

// CORS Configuration
const corsOptions = {
  origin: '*', // Using wildcard for maximum compatibility during diagnostics
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/visits', visitRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`)); 