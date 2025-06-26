const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  presentingComplaint: {
    type: String,
    default: ''
  },
  previousHistory: {
    type: String,
    default: ''
  },
  vitals: {
    hr: { type: String, default: '' },
    bp: { type: String, default: '' },
    rr: { type: String, default: '' },
    temp: { type: String, default: '' },
    bsr: { type: String, default: '' },
  },
  physicalExamination: {
    general: { type: String, default: '' },
    cvs: { type: String, default: '' },
    resp: { type: String, default: '' },
    abd: { type: String, default: '' },
    neuro: { type: String, default: '' },
  },
  prescription: [ // Rx
    {
      medicine: { type: String, default: '' },
      dose: { type: String, default: '' },
      frequency: { type: String, default: '' },
    }
  ],
  // The old 'notes' field is now replaced by the more specific fields above
});

module.exports = mongoose.model('Visit', VisitSchema); 