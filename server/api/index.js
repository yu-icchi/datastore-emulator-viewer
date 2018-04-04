const { Router } = require('express')

const datastore = require('./datastore')

const router = Router()

router.use(datastore)

module.exports = router
