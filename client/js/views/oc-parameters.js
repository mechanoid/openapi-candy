import { html } from '/assets/vendor/lit-html/lit-html.js'

const badge = (param, text, options = {}) => {
  const classes = options.classes ? options.classes : ''
  return param
    ? html`<span class="badge badge-secondary ${classes}">${text}</span>`
    : ''
}

const parameterType = config => {
  if (config.schema) {
    return html`${config.schema.type} ${config.schema.format ? html`(${config.schema.format})` : ''}`
  } else if (config.content) {
    // TODO: handle content rendering for parameters
    return html``
  }

  return ''
}

// TODO: handle allowEmpty for params
export const parameterSection = (parameters, type = null) => {
  if (parameters.length > 0) {
    // TODO: add commonmark rendering for description

    const paramRows = parameters.map(
      param => html`
        <tr>
          <td><span class="oc-param-name">${param.name}</span></td>
          <td>${param.description}</td>
          <td>${parameterType(param)}</td>
          <td>
            ${badge(param.required, 'required', { classes: 'badge-primary' })}
            ${badge(param.deprecated, 'deprecated', { classes: 'badge-warning' })}
          </td>
          <td>
            ${param.example ? html`<pre class="oc-param-example">${param.example}</pre>` : ''}
          </td>
        </tr>
      `
    )

    return html`
      <oc-param-section>
        ${type ? html`<header><h4>${type} parameters</h4></header>` : ''}
        <table class="table">
          <tbody></tbody>
          <thead>
            <th>parameter</th>
            <th>Description</th>
            <th>type</th>
            <th>Info</th>
            <th>example</th>
          </thead>
          <tbody>
            ${paramRows}
          </tbody>
        </table>
      </oc-param-section>
    `
  }

  return ''
}

export const parameters = (operation, options = {}) => {
  const parameters = operation.parameters

  if (parameters) {
    const paramTypes = ['header', 'path', 'query', 'cookie']

    const paramTables = paramTypes.map(type => {
      const params = parameters.filter(p => p.in === type)

      return parameterSection(params, type)
    })

    return html`
      <oc-parameters>${paramTables}</oc-parameters>
    `
  }

  return ''
}
