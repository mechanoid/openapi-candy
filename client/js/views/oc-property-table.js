import { html } from '/assets/vendor/lit-html/lit-html.js'
import { isArray } from '/assets/client/js/util/object-helper.js'
import { componentId } from '/assets/client/js/views/oc-components.js'

const propRequired = (schema, propName) => schema.required && schema.required.indexOf(propName) >= 0

const badge = (param, text, options = {}) => {
  const classes = options.classes ? options.classes : ''
  return param
    ? html`<span class="badge badge-secondary ${classes}">${text}</span>`
    : ''
}

const propertyRow = (schema, property) => {
  const data = property.data || {}

  return html`
  <tr>
    <td>${property.name}</td>
    <td>${data && data.description}</td>
    <td>${data.format || data.type || property.type}${data.default ? `(${data.default})` : ''}</td>
    <td>
      ${propRequired(schema, property.name) ? badge(true, 'required') : ''}
    </td>
  </tr>
`
}

const refRow = (property) => {
  const data = property.data || {}

  return html`
  <tr>
    <td>${property.name}</td>
    <td>${data && data.description}</td>
    <td colspan="2"><a href="#${componentId(property)}">${property.$ref}</a></td>
  </tr>
`
}

const propertyPrintName = (propName, options = {}) => {
  const name = propName || ''

  if (options.baseName) {
    return name !== '' ? `${options.baseName}.${name}` : options.baseName
  }

  return name
}

const property = (propName, prop, options = {}) => ({
  name: propertyPrintName(propName, options),
  data: !options.$ref ? flattenedProperties(prop, { baseName: options.baseName ? `${options.baseName}.${propName}` : propName }) : null,
  $ref: options.$ref,
  type: options.type
})

const collectProperties = (properties, schema, options = { baseName: '' }) => Object.keys(properties).flatMap(propName => {
  const prop = property(propName, properties[propName], { baseName: options.baseName, required: propRequired(schema, propName), type: options.type })

  if (isArray(prop.data)) {
    prop.type = 'array'
    return [prop].concat(prop.data)
  }

  return [prop]
})

const flattenedProperties = (schema, options = {}) => {
  const baseName = options.baseName || ''

  if (schema.$ref) {
    return [property(null, schema, Object.assign({}, options, { $ref: schema.$ref }))]
  } else if (schema.properties) {
    return collectProperties(schema.properties, schema, Object.assign({}, options, { type: 'object' }))
  } else if (schema.type === 'array' && schema.items && schema.items.$ref) {
    return [property(null, schema, Object.assign({}, options, { baseName: `${baseName}[]`, $ref: schema.items.$ref }))]
  } else if (schema.type === 'array' && schema.items && schema.items.properties) {
    return collectProperties(schema.items.properties, schema, Object.assign({}, options, { baseName: `${baseName}[]`, type: 'array' }))
  } else {
    return schema
  }
}

export const propertyTable = (schema) => {
  const properties = flattenedProperties(schema)

  if (properties.length <= 0) {
    return ''
  }

  return html`
    <table class="table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Description</th>
          <th>Type/Format (Default)</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
        ${properties.map(p => p.$ref ? refRow(p) : propertyRow(schema, p))}
      </tbody>
    </table>
  `
}
