import { html } from '/assets/vendor/lit-html/lit-html.js'

const propRequired = (schema, propName) => schema.required && schema.required.indexOf(propName) >= 0

const badge = (param, text, options = {}) => {
  const classes = options.classes ? options.classes : ''
  return param
    ? html`<span class="badge badge-secondary ${classes}">${text}</span>`
    : ''
}

const propertyRow = (schema, propName, prop) => html`
  <tr>
    <td>${propName}</td>
    <td>${prop.description}</td>
    <td>${prop.format || prop.type}${prop.default ? prop.default : ''}</td>
    <td>
      ${propRequired(schema, propName) ? badge(true, 'required') : ''}
    </td>
  </tr>
`

export const propertyTable = schema => {
  if (!schema.properties) {
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
        ${Object.keys(schema.properties).map(propName => propertyRow(schema, propName, schema.properties[propName]))}
      </tbody>
    </table>
  `
}
