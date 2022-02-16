const router = require('express').Router();

router.use('/api/health-check', require('./health-check.routes'));

module.exports = router;
