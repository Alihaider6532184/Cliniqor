const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  caseSummary: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['opd', 'ward']
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  visits: [{
    type: Schema.Types.ObjectId,
    ref: 'Visit'
  }]
  // We will add a reference to visits later
});

module.exports = mongoose.model('Patient', PatientSchema); 