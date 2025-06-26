const Visit = require('../models/visit.model');
const Patient = require('../models/patient.model');
const { validationResult } = require('express-validator');

// @route   POST api/visits/:patientId
// @desc    Add new visit for a patient
// @access  Private
exports.createVisit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { date, presentingComplaint, previousHistory, vitals, physicalExamination, prescription } = req.body;
  const { patientId } = req.params;

  try {
    // Check if patient exists and belongs to the doctor
    const patient = await Patient.findById(patientId);
    if (!patient || patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Patient not found or not authorized' });
    }
    
    const newVisit = new Visit({
      date,
      presentingComplaint,
      previousHistory,
      vitals,
      physicalExamination,
      prescription,
      patient: patientId,
      doctor: req.user.id,
    });

    const visit = await newVisit.save();

    // Add visit to patient's visit array
    patient.visits.push(visit.id);
    await patient.save();

    res.json(visit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/visits/:patientId
// @desc    Get all visits for a patient
// @access  Private
exports.getVisits = async (req, res) => {
  try {
    // Check if patient exists and belongs to the doctor
    const patient = await Patient.findById(req.params.patientId);
    if (!patient || patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Patient not found or not authorized' });
    }

    const visits = await Visit.find({ patient: req.params.patientId }).sort({ date: -1 });
    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 