import { baseUrl } from '/assets/client/js/oc-url-helper.js'
import { html } from '/assets/vendor/lit-html/lit-html.js'
import { propertyTable } from '/assets/client/js/oc-property-table.js'

const componentCategories = ['schemas', 'responses', 'parameters', 'examples', 'requestBodies', 'headers', 'securitySchemes', 'links', 'callbacks']

const componentHash = (category, componentName) => `#/components/${category}/${componentName}`

export const componentsByCategory = (components, options = {}) => componentCategories.reduce((categories, category) => {
  const specUrl = baseUrl(options.specPath)
  const componentsForCategory = components[category]

  if (componentsForCategory) {
    categories[category] = Object.keys(componentsForCategory).reduce((components, componentName) => {
      const component = componentsForCategory[componentName]

      const componentUrl = new URL(specUrl)
      componentUrl.hash = componentHash(category, componentName)

      components[componentName] = {
        ref: componentUrl.toString(),
        data: component
      }

      return components
    }, {})
  }

  return categories
}, {})

const component = (componentName, component) => html`
  <oc-component id="component.$ref" class="card mb-3">
    <h4>${componentName}</h4>
    <oc-tabbed-content>
      <ul class="nav nav-pills">
        <li class="nav-item"><a href="" class="oc-tabbed-content-tab nav-link active" data-target="properties">Properties</a></li>
        <li class="nav-item"><a href="" class="oc-tabbed-content-tab nav-link" data-target="schema">Schema</a></li>
      </ul>

      <div class="oc-tabbed-content-tab-panel active" data-content="properties">
        ${propertyTable(component.data)}
      </div>
      <div class="oc-tabbed-content-tab-panel" data-content="schema">
        <pre><code class="JSON">${JSON.stringify(component.data, null, 2)}</code></pre>
      </div>

    </oc-tabbed-content>
  </oc-component>
`

const category = (categoryName, components) => html`
  <oc-component-category>
    <h3>${categoryName}</h3>
    ${Object.keys(components).map(componentName => component(componentName, components[componentName]))}
  </oc-component-category>
`

export const renderComponents = (components, options = {}) => {
  const categories = componentsByCategory(components, options)
  return html`${Object.keys(categories).map(catName => category(catName, categories[catName]))}`
}
