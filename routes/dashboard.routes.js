const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/dashboard.controller');

router.get('/', auth, ctrl.getDashboard);
module.exports = router;
