/* global HTMLElement, customElements, slug */
import { OCPathOperation } from '/assets/client/js/oc-path-operation.mjs'
import { render, html } from '/assets/vendor/lit-html/lit-html.js'

const SUPPORTED_HTTP_VERBS = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace'
]

const hasKey = (obj, key) => Object.keys(obj).indexOf(key) >= 0

const operationsForSupportedVerbs = path => {
  return SUPPORTED_HTTP_VERBS.reduce((ops, verb) => {
    if (hasKey(path, verb)) {
      ops[verb] = path[verb]
    }
    return ops
  }, {})
}

const operationMenuTab = (operationId, verb, operation, firstItem) => {
  const activeClass = firstItem ? 'active' : ''

  return html`
    <li class="nav-item ${activeClass}">
      <a
        class="nav-link ${activeClass}"
        id="${operationId}-tab"
        data-toggle="pill"
        href="#${operationId}"
        role="tab"
        aria-controls="${operationId}"
        aria-selected="${!!firstItem}"
      >
        ${verb.toUpperCase()}
      </a>
    </li>
  `
}

const operationContentTab = (path, operationId, verb, operation, firstItem) => {
  const activeClass = firstItem ? 'show active' : ''

  const content = new OCPathOperation(path, verb, operation)

  return html`
    <div
      class="tab-pane fade ${activeClass}"
      id="${operationId}"
      role="tabpanel"
      aria-labelledby="${operationId}-tab"
    >
      ${content}
    </div>
  `
}

const operationsTabMenu = (linkRelID, operations) => {
  const tabs = Object.keys(operations).map((verb, index) => {
    const operation = operations[verb]
    const operationId = operation.operationId || `${linkRelID}-${verb}`

    return operationMenuTab(operationId, verb, operations[verb], index === 0)
  })

  return html`
    <ul
      class="tab-menu nav nav-pills mb-3"
      role="tablist"
      id="${linkRelID}-tab-menu">
      ${tabs}
    </ul>
  `
}
//
const operationsTabContent = (linkRelID, path, operations) => {
  const tabs = Object.keys(operations).map((verb, index) => {
    const operation = operations[verb]
    const operationId = operation.operationId || `${linkRelID}-${verb}`

    return operationContentTab(
      path,
      operationId,
      verb,
      operations[verb],
      index === 0
    )
  })

  return html`<div class="tab-content" id="${linkRelID}-tab-content">${tabs}</div>`
}

class OCPathOperations extends HTMLElement {
  constructor (linkRelID, path, operations) {
    super()
    this.operations = operations
    this.linkRelID = linkRelID
    this.path = path
  }

  render () {
    return render(
      html`
        ${operationsTabMenu(this.linkRelID, this.operations)}
        ${operationsTabContent(this.linkRelID, this.path, this.operations)}
      `,
      this
    )
  }

  connectedCallback () {
    this.render()
    this.tabLinks.forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href')

        if (href && href[0] === '#') {
          const tabID = href.slice(1)
          const tab = document.getElementById(tabID)

          this.deactivateAllTabs()
          link.classList.add('active')
          tab.classList.add('active', 'show')
        }
      })
    })
  }

  deactivateAllTabs () {
    this.tabs.forEach(tab => tab.classList.remove('active', 'show'))
    this.tabLinks.forEach(tab => tab.classList.remove('active'))
  }

  get tabs () {
    if (this._tabs) {
      return this._tabs
    }

    const tabs = this.tabContent.querySelectorAll('.tab-pane')

    if (tabs.length > 0) {
      this._tabs = Array.prototype.slice.call(tabs)
      return this._tabs
    }

    return []
  }

  get tabMenu () {
    if (this._tabMenu) {
      return this._tabMenu
    }

    this._tabMenu = this.querySelector('.tab-menu')
    return this._tabMenu
  }

  get tabContent () {
    if (this._tabContent) {
      return this._tabContent
    }

    this._tabContent = this.querySelector('.tab-content')
    return this._tabContent
  }

  get tabLinks () {
    if (this._tabLinks) {
      return this._tabLinks
    }

    const links = this.tabMenu.querySelectorAll('a')
    if (links.length > 0) {
      this._tabLinks = Array.prototype.slice.call(links)
      return this._tabLinks
    }

    return []
  }
}

customElements.define('oc-path-operations', OCPathOperations)

export const pathOperations = path => {
  const linkRelID = path.data['x-link-rel']

  const operations = operationsForSupportedVerbs(path.data)

  const pathOperations = new OCPathOperations(linkRelID, path, operations)

  return pathOperations
}
