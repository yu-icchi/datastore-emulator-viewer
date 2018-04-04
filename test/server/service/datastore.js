'use strict'

const datastore = require('../../../server/service/datastore')

describe('server/service/datastore', () => {
  it('OK_Kinds', async () => {
    const kinds = await datastore.getKinds('vigo-dev')
    console.log(kinds)
  })

  it('OK_Property', async () => {
    const properties = await datastore.getProperty('vigo-dev', '_Task')
    console.log(properties)
  })

  it('OK_load', async () => {
    const ret = await datastore.load('vigo-dev', ['Task2', 'task02'])
    console.log(JSON.stringify(ret, null, 2))
  })

  it('OK_save', async () => {
    const ret = await datastore.save('vigo-dev', ['_Test2', 'sample01'], {id: 'sample02', num: 3.15, bool: true})
    console.log(JSON.stringify(ret, null, 2))
  })

  it('OK_find', async () => {
    const ret = await datastore.find('vigo-dev', 'Task')
    console.log(JSON.stringify(ret, null, 2))
  })

  it('OK_total', async () => {
    await datastore.total('vigo-dev')
  })
})
