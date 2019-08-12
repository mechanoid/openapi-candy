import { html } from '/assets/vendor/lit-html/lit-html.js'
import { apiResourceLink } from '/assets/client/js/uri-templates.js'
import { componentId, renderComponents } from '/assets/client/js/views/oc-components.js'
import { renderPaths } from '/assets/client/js/views/oc-paths.js'

const menuItem = (path, options) => html`
  <li>
    <a class="main-nav-link ${options.currentLinkRel === path['x-link-rel'] ? 'active' : ''}" href="
      ${apiResourceLink({ spec: options.specPath, linkRel: path['x-link-rel'] })}
    ">
      ${path.summary || path['x-link-rel']}
      ${path.summary && path['x-link-rel'] ? html`<span class="oc-main-nav-link-summary">${path['x-link-rel']}</span>` : ''}
    </a>
  </li>
`

const componentMenuItem = (componentName, component, options = {}) => html`
      <li class="condensed">
        <a href="#${componentId(component)}">${componentName}</a>
      </li>
    `

const menuItems = (paths, options = {}) => paths
  ? Object.keys(paths).map(pathName => {
    const path = paths[pathName]
    return menuItem(path, options)
  }) : ''

const menu = (spec, options = {}) => html`
      <ul class="nav flex-column  col-12">
        ${menuItems(spec.paths, options)}
      </ul>
    `

const componentCategories = (categories, options = {}) => categories
  ? Object.keys(categories).map(categoryName => {
    const components = categories[categoryName]

    return html`
          <h5>${categoryName}</h5>
          ${Object.keys(components).map(componentName => componentMenuItem(componentName, components[componentName], options))}
        `
  }) : ''

const componentMenu = (components, options = {}) => html`
      <h4>Components</h4>
      <ul class="nav flex-column  col-12">
        ${componentCategories(components, options)}
      </ul>
    `

// TODO: render `termsOfService` if available
// TODO: render `contact` if available
// TODO: render `license` if available
const specHeader = info => html`
      <header class="spec-header">
        <h2>${info.title} (${info.version})</h2>
        ${info.description
    ? html`<p>${info.description}</p>`
    : ''}
      </header>
    `

const content = (spec, components, meta) => html`
      ${specHeader(spec.info)}
      ${renderPaths(spec.paths, meta)}
      ${renderComponents(components, meta)}
    `

export const specLayout = (spec, components, meta) => html`
  <div class="row">
    <div class="oc-spec-menu col-md-3 col-lg-2">
      <div class="oc-main-menu col-md-3 col-lg-2">
        ${menu(spec, components, meta)}
        ${componentMenu(components, meta)}
      </div>
    </div>
    <div class="oc-spec-content col-md-9 col-lg-10">${content(spec, components, meta)}</div>
  </div>
`
