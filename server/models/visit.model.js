const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
  medicine: { type: String, required: true },
  dose: { type: String, required: true },
  frequency: { type: String, required: true },
}, { _id: false });

const visitSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  presentingComplaint: {
    type: String,
    default: '',
  },
  previousHistory: {
    type: String,
    default: '',
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
  prescription: [prescriptionSchema],
}, {
  timestamps: true,
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit; 