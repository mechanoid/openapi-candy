const propertiesFromHash = rawHash => {
  const hash = rawHash.slice(1) // remove #
  return hash.split('/').filter(prop => !!prop)
}

const resolveObjectFromHash = (item, hash) =>
  propertiesFromHash(hash).reduce((nested, prop, index) => nested[prop], item)

export const resolveObject = async (item, options = {}) => {
  if (!item.$ref) {
    return item
  }

  const ref = item.$ref
  const url = new URL(ref, options.baseUrl)
  const hash = url.hash

  return (
    fetch(url)
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
      // NOTE: Merge behavior is undefined, so just try a simple Object.assign($ref, pathItem)
      //       See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#fixed-fields-7
      .then(res => Object.assign({}, res, item))
  )
}
