const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const visitController = require('../controllers/visit.controller');

// @route   GET api/visits/:patientId
// @desc    Get all visits for a patient
// @access  Private
router.get('/:patientId', auth, visitController.getVisits);

// @route   POST api/visits/:patientId
// @desc    Add new visit for a patient
// @access  Private
router.post(
  '/:patientId',
  [
    auth,
    [
      check('date', 'Date is required').not().isEmpty(),
    ]
  ],
  visitController.createVisit
);

module.exports = router; 