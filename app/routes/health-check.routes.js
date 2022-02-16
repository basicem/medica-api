module.exports = (app) => {
  const healthCheck = require('../controllers/health-check.controller.js');
  const router = require('express').Router();

  router.get('/', healthCheck.status);
  app.use('/api/health-check', router);
};
