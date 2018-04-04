'use strict'

const _ = require('lodash')
const Datastore = require('@google-cloud/datastore')

// TODO: projectIdを起動時にいれるか？

function genKey (key) {
  const param = {
    namespace: key.namespace,
    id: key.id,
    name: key.name,
    kind: key.kind,
    path: key.path,
  }
  if (key.parent) {
    param.parent = genKey(key.parent)
  }
  return param
}

function keyPath (key) {
  let temp = [key.kind]
  if (key.id) {
    temp.push(Number(key.id))
  } else {
    temp.push(key.name)
  }
  if (key.parent) {
    const t = keyPath(key.parent)
    if (Array.isArray(t) && t.length > 0) {
      temp = t.concat(temp)
    }
  }
  return temp
}

function encodeKey (key) {
  const path = keyPath(key)
  return Buffer.from(JSON.stringify(path), 'utf8').toString('base64')
}

function isInteger (x) {
  return Math.round(x) === x
}

function genType (value) {
  if (Datastore.isInt(value)) {
    return 'int'
  }
  if (Datastore.isDouble(value)) {
    return 'double'
  }
  if (Datastore.isGeoPoint(value)) {
    return 'geo_point'
  }
  if (Datastore.isKey(value)) {
    return 'key'
  }
  if (_.isArray(value)) {
    return 'array'
  }
  if (_.isBoolean(value)) {
    return 'boolean'
  }
  if (_.isBuffer(value)) {
    return 'buffer'
  }
  if (_.isDate(value)) {
    return 'date'
  }
  if (_.isNumber(value) && isInteger(value)) {
    return 'int'
  }
  if (_.isNumber(value) && !isInteger(value)) {
    return 'double'
  }
  if (_.isString(value)) {
    return 'string'
  }
  return ''
}

exports.getKinds = async function (projectId) {
  const datastore = new Datastore({projectId})
  const query = datastore.createQuery('__kind__').select('__key__')
  const ret = await datastore.runQuery(query)
  return ret[0].map((entity) => entity[datastore.KEY].name)
}

exports.getProperty = async function (projectId, kind) {
  const datastore = new Datastore({projectId})
  const ancestorKey = datastore.key(['__kind__', kind])
  const query = datastore.createQuery('__property__').hasAncestor(ancestorKey)
  const result = await datastore.runQuery(query)
  if (!result || !Array.isArray(result[0]) || !result[0].length) {
    return []
  }
  const properties = []
  result[0].forEach((entity) => {
    const key = entity[datastore.KEY]
    properties.push({
      name: key.name,
      type: entity.property_representation
    })
  })
  return properties
}

exports.total = async function (projectId) {
  const datastore = new Datastore({projectId})
  const query = datastore.createQuery('__Stat_Ns_Total__')
  const ret = await datastore.runQuery(query)
  console.log(ret)
}

exports.load = async function (projectId, keys) {
  const datastore = new Datastore({projectId})
  const key = datastore.key(keys)
  const ret = await datastore.get(key, {pretty: true})
  if (!Array.isArray(ret) || !ret.length) {
    return []
  }
  const entity = ret[0]
  return [
    {
      key: genKey(entity[datastore.KEY]),
      encodeKey: encodeKey(entity[datastore.KEY]),
      data: entity.data
    }
  ]
}

exports.save = async function (projectId, keys, data) {
  const datastore = new Datastore({projectId})
  const key = datastore.key(keys)
  const entity = {key, data}
  const ret = await datastore.save(entity)
  return ret
}

exports.find = async function (projectId, kind, q) {
  const datastore = new Datastore({projectId})
  const query = datastore.createQuery(kind)
  const ret = await datastore.runQuery(query)
  const list = []
  ret[0].forEach((item) => {
    const key = genKey(item[datastore.KEY])
    list.push({
      key: key,
      encodeKey: encodeKey(key),
      data: item
    })
  })
  return {
    list: list,
    moreResults: ret[1].moreResults,
    endCursor: ret[1].endCursor
  }
}
