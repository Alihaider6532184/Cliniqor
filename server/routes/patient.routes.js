const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const patientController = require('../controllers/patient.controller');

// @route   GET api/patients/details/:id
// @desc    Get single patient by ID
// @access  Private
router.get('/details/:id', auth, patientController.getPatientById);

// @route   GET api/patients/:category
// @desc    Get all patients for a doctor
// @access  Private
router.get('/:category', auth, patientController.getPatients);

// @route   POST api/patients
// @desc    Add new patient
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('caseSummary', 'Case summary is required').not().isEmpty(),
      check('category', 'Category is required').isIn(['opd', 'ward']),
    ]
  ],
  patientController.createPatient
);

// @route   PUT api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', auth, patientController.updatePatient);

// @route   DELETE api/patients/:id
// @desc    Delete patient
// @access  Private
router.delete('/:id', auth, patientController.deletePatient);

module.exports = router; 