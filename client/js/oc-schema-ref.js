/* global fetch */
import { baseUrl } from '/assets/client/js/oc-url-helper.js'

class ArrayWithRef extends Array {
  set $ref (ref) {
    this._$ref = ref
  }

  get $ref () {
    return this._$ref
  }
}

class ObjectWithRef extends Object {
  set $ref (ref) {
    this._$ref = ref
  }

  get $ref () {
    return this._$ref
  }
}

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

export const resolveObjectRefRef = async (item, options = {}) => {
  if (!item.$ref && !options.itemIsURI) {
    return {
      baseUrl: options.baseUrl,
      data: item,
      resolveChain: options.resolveChain
    }
  }

  const ref = options.itemIsURI ? item : item.$ref

  const url = new URL(ref, options.baseUrl)
  const hash = url.hash

  if (options.resolveChain.indexOf(url.toString()) >= 0) {
    throw new Error(`circular spec reference for ${url}`)
  }
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
      if (isArray(res)) {
        return new ArrayWithRef(res)
      }

      return res
    })
    .then(res => {
      res.$ref = url.toString()
      return res
    })
    .then(res => ({
      // when the object is loaded from a differnt source, it has to be the baseUrl for
      // internal lookups of other refs
      baseUrl: url,
      data: res,
      resolveChain: (options.resolveChain || []).concat(url.toString())
    }))
}

const resolveArray = async (schema, formerBaseUrl, formerResolveChain = []) =>
  Promise.all(schema.map(async item => resolveSchema(item, formerBaseUrl, formerResolveChain)))

const resolveURI = async (schemaSrc, formerBaseUrl, formerResolveChain = [], options = {}) => {
  const { data, baseUrl, resolveChain } = await resolveObjectRefRef(schemaSrc, { baseUrl: formerBaseUrl, itemIsURI: options.schemaIsURI, resolveChain: formerResolveChain })

  return resolveSchema(data, baseUrl, resolveChain)
}

const resolveObject = async (schema, formerBaseUrl, formerResolveChain = []) => Object.keys(schema).reduce(async (previousPromise, prop) => {
  const result = await previousPromise
  const item = schema[prop]

  try {
    const { data, baseUrl, resolveChain } = await resolveObjectRefRef(item, { baseUrl: formerBaseUrl, resolveChain: formerResolveChain })

    const dereferenced = await resolveSchema(data, baseUrl, resolveChain)
    result[prop] = dereferenced
  } catch (e) {
    console.log(e)
  }

  return result
}, Promise.resolve({}))

export const resolveSchema = async (schema, baseUrl, resolveChain = [], options = {}) => {
  if (!baseUrl) {
    throw new Error(`baseUrl is required: ${JSON.stringify(schema)}`)
  }

  if (options.schemaIsURI) {
    return resolveURI(schema, baseUrl, resolveChain, options)
  } else if (isObject(schema)) {
    return resolveObject(schema, baseUrl, resolveChain)
  } else if (isArray(schema)) {
    return resolveArray(schema, baseUrl, resolveChain)
  } else {
    return schema
  }
}

export const loadSchema = async schemaSrc => {
  return resolveSchema(schemaSrc, baseUrl(schemaSrc), [], { schemaIsURI: true })
}
