/* global fetch */
const propertiesFromHash = rawHash => {
  const hash = rawHash.slice(1) // remove #
  return hash.split('/').filter(prop => !!prop)
}

const resolveObjectFromHash = (item, hash) =>
  propertiesFromHash(hash).reduce((nested, prop, index) => nested[prop], item)

const resultWithMetaData = (res, baseUrl) => ({
  meta: {
    baseUrl: baseUrl
  },
  data: res
})

export const resolveObject = async (item, options = {}) => {
  if (!item.$ref) {
    return resultWithMetaData(item, options.baseUrl)
  }

  const ref = item.$ref
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

      return resolveObjectFromHash(res, hash)
    })
    .then(res => {
      if (Object.keys(item).length > 1) {
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
