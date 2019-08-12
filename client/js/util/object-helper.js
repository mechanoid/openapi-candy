export const typeOfObject = object => {
  const objectTypePattern = /\[object (.*)\]/
  const stringifiedType = Object.prototype.toString.call(object)
  const match = stringifiedType.match(objectTypePattern)

  if (match) {
    return match[1]
  } else {
    throw new Error(`unknown type of object for "${object}"`)
  }
}

export const isObject = object => typeOfObject(object) === 'Object'
export const isArray = object => typeOfObject(object) === 'Array'
