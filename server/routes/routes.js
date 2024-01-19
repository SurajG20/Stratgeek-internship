const express = require('express');

const {
  getContributions,
  getPRsReviewedAndCreated,

} = require('../controllers/controllers');

const router = express.Router();

router.route('/contributions/:username').get(getContributions);
router.route('/prs/:username').get(getPRsReviewedAndCreated);

module.exports = router;
