/* global fetch */
import { baseUrl } from '/assets/client/js/oc-url-helper.mjs'

const typeOfObject = object => {
  const objectTypePattern = /\[object (.*)\]/
  const stringifiedType = Object.prototype.toString.call(object)
  const match = stringifiedType.match(objectTypePattern)

  if (match) {
    return match[1]
  } else {
    throw new Error(`unknown type of object for "${object}"`)
  }
}

const isObject = object => typeOfObject(object) === 'Object'

const isArray = object => typeOfObject(object) === 'Array'

const propertiesFromHash = rawHash => {
  const hash = rawHash.slice(1) // remove #
  return hash.split('/').filter(prop => !!prop)
}

const resolveObjectRefFromHash = (item, hash) =>
  propertiesFromHash(hash).reduce((nested, prop, index) => nested[prop], item)

const resultWithMetaData = (res, baseUrl) => ({
  baseUrl,
  data: res
})

export const resolveObjectRefRef = async (item, options = {}) => {
  if (!item.$ref && !options.itemIsURI) {
    return resultWithMetaData(item, options.baseUrl)
  }

  const ref = options.itemIsURI ? item : item.$ref
  const url = new URL(ref, options.baseUrl)
  const hash = url.hash

  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`cannot resolve $ref ${ref}`)
      }
      return res
    })
    .then(res => res.json())
    .then(res => {
      if (!hash) {
        return res
      }

      return resolveObjectRefFromHash(res, hash)
    })
    .then(res => {
      if (isObject(res) && isObject(item)) {
        return Object.assign({}, res, item) // for keys in main spec and in referenced item, the result is undefined. We merge!
      }
      return res
    })
    .then(res => {
      // when the object is loaded from a differnt source, it has to be the baseUrl for
      // internal lookups of other refs
      return resultWithMetaData(res, url)
    })
}

const resolveArray = async (schema, baseUrl) => Promise.all(schema.map(async item => {
  const resolved = await resolveObjectRefRef(item, { baseUrl })
  return resolveSchema(resolved.data, resolved.baseUrl)
}))

const resolveURI = async (schemaSrc, baseUrl, options = {}) => {
  const resolved = await resolveObjectRefRef(schemaSrc, { baseUrl, itemIsURI: options.schemaIsURI })
  const dereferenced = await resolveSchema(resolved.data, resolved.baseUrl)
  return dereferenced
}

const resolveObject = async (schema, baseUrl) => Object.keys(schema).reduce(async (previousPromise, prop) => {
  const result = await previousPromise
  const item = schema[prop]

  try {
    const resolved = await resolveObjectRefRef(item, { baseUrl })
    const dereferenced = await resolveSchema(resolved.data, resolved.baseUrl)
    result[prop] = dereferenced
  } catch (e) {
    console.log(e)
  }

  return result
}, Promise.resolve({}))

export const resolveSchema = async (schema, baseUrl, options = {}) => {
  if (!baseUrl) {
    throw new Error(`baseUrl is required: ${JSON.stringify(schema)}`)
  }

  if (options.schemaIsURI) {
    return resolveURI(schema, baseUrl, options)
  } else if (isObject(schema)) {
    return resolveObject(schema, baseUrl)
  } else if (isArray(schema)) {
    return resolveArray(schema, baseUrl)
  } else {
    return schema
  }
}

export const loadSchema = async (schemaSrc) => {
  return resolveSchema(schemaSrc, baseUrl(schemaSrc), { schemaIsURI: true })
}
