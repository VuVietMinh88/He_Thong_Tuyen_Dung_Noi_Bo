// backend/src/routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const { getRoles } = require('../controllers/roleController');

// GET /api/roles
router.get('/roles', getRoles);

module.exports = router;