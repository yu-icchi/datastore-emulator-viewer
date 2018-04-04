'use strict'

const { Router } = require('express')
const router = Router()

const datastore = require('../service/datastore')

router.get('/datastore/kinds', async (req, res) => {
  const projectId = process.env.DATASTORE_PROJECT_ID
  const kinds = await datastore.getKinds(projectId)
  return res.json({kinds})
})

router.get('/datastore/kinds/:kind', async (req, res) => {
  const projectId = process.env.DATASTORE_PROJECT_ID
  const kind = req.params.kind
  const query = req.query.q
  const ret = await datastore.find(projectId, kind, query)
  return res.json(ret)
})

router.get('/datastore/kinds/:kind/property', async (req, res) => {
  const projectId = process.env.DATASTORE_PROJECT_ID
  const kind = req.params.kind
  const ret = await datastore.getProperty(projectId, kind)
  return res.json({
    kind: kind,
    property: ret
  })
})

router.get('/datastore/entities', async (req, res) => {
  const projectId = process.env.DATASTORE_PROJECT_ID
  const key = req.query.key
  const keys = JSON.parse(Buffer.from(key, 'base64').toString('utf8'))
  const ret = await datastore.load(projectId, keys)
  return res.json({
    entities: ret
  })
})

router.post('/datastore/entities', async (req, res) => {

})

module.exports = router
