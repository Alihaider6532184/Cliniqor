const Patient = require('../models/patient.model');
const { validationResult } = require('express-validator');

// @route   GET api/patients/:category
// @desc    Get all patients for a doctor in a specific category
// @access  Private
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({
      doctor: req.user.id,
      category: req.params.category
    }).sort({ dateAdded: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/patients
// @desc    Add new patient
// @access  Private
exports.createPatient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, caseSummary, category } = req.body;

  try {
    const newPatient = new Patient({
      name,
      caseSummary,
      category,
      doctor: req.user.id
    });

    const patient = await newPatient.save();
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/patients/:id
// @desc    Update patient
// @access  Private
exports.updatePatient = async (req, res) => {
  const { name, caseSummary, category } = req.body;

  // Build patient object
  const patientFields = {};
  if (name) patientFields.name = name;
  if (caseSummary) patientFields.caseSummary = caseSummary;
  if (category) patientFields.category = category;

  try {
    let patient = await Patient.findById(req.params.id);

    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    // Make sure user owns patient
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: patientFields },
      { new: true }
    );

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/patients/:id
// @desc    Delete patient
// @access  Private
exports.deletePatient = async (req, res) => {
  try {
    let patient = await Patient.findById(req.params.id);

    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    // Make sure user owns patient
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Patient removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/patients/details/:id
// @desc    Get single patient details
// @access  Private
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    // Make sure user owns patient
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 