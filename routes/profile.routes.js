const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profile.controller')

// GET profile by id
router.get('/:id', profileController.getProfile)

// UPDATE profile
router.put('/:id', profileController.updateProfile)

module.exports = router
