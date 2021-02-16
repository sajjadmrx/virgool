const express = require('express')
const router = express.Router();

//routers
const homeRoutes = require('./home')
const adminRoutes = require('./admin')
const authRoutes = require('./auth')
const panelRoutes = require('./user')


//middelwaer
const redirectIfNotAuth = require('../../http/middleware/redirectIfNotAuth')
const redirectIfAuth = require('../../http/middleware/redirectIfAuthed')

router.use('/admin', redirectIfNotAuth.handel, adminRoutes)
router.use('/auth', redirectIfAuth.handel, authRoutes)
router.use('/panel',redirectIfNotAuth.handel, panelRoutes)
router.use('/', homeRoutes)

module.exports = router;