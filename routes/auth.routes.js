const express = require('express')
const router = express.Router()
const upload = require('../utils/upload')
const auth = require('../controllers/auth.controller')

// REGISTER & LOGIN
router.post('/register', upload.single('profile_image'), auth.register)
router.post('/login', auth.login)

// ✅ PROFILE
router.get('/profile/:id', auth.getProfile)

module.exports = router