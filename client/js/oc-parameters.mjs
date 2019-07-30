import { html } from '/assets/vendor/lit-html/lit-html.js'

const badge = (param, text, options = {}) => {
  const classes = options.classes ? options.classes : ''
  return param
    ? html`<span class="badge badge-secondary ${classes}">${text}</span>`
    : ''
}

// TODO: handle allowEmpty for params
const parameterSection = (type, parameters) => {
  if (parameters.length > 0) {
    // TODO: add commonmark rendering for description

    const paramRows = parameters.map(
      param => html`
        <tr>
          <td><span class="oc-param-name">${param.name}</span></td>
          <td>${param.description}</td>
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
        <oc-foldable>
          <header>
            <h5>${type} parameters</h5>
          </header>
          <oc-foldable-container>
            <table class="table">
              <tbody></tbody>
              <thead>
                <th>parameter</th>
                <th colspan="2"></th>
                <th>example</th>
              </thead>
              <tbody>
                ${paramRows}
              </tbody>
            </table>
          </oc-foldable-container>
        </oc-foldable>
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

      return parameterSection(type, params)
    })

    return html`
      <oc-parameters>${paramTables}</oc-parameters>
    `
  }

  return ''
}
