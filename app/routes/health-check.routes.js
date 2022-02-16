const router = require('express').Router();
const healthCheck = require('../controllers/health-check.controller.js');

router.get('/', healthCheck.status);

module.exports = router;
