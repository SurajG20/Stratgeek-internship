const express = require('express');

const {
  getContributions,
  getPRsReviewedAndCreated,
} = require('../controllers/controllers');

const router = express.Router();

router.route('/contributions').get(getContributions);
router.route('/prs').get(getPRsReviewedAndCreated);

module.exports = router;
