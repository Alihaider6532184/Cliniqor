const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

require('dotenv').config({ path: './.env' });
require('./config/passport'); // Load passport config

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Session and Passport Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'a_default_secret_for_session', // Use an env variable
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/patients', require('./routes/patient.routes'));
app.use('/api/visits', require('./routes/visit.routes'));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}); 