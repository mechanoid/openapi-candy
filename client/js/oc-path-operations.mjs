import { ulid } from '/assets/vendor/ulid/index.esm.js'
import { fromString, injectElements } from '/assets/client/js/oc-minitemp.mjs'

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

const pathItemOperations = pathItem =>
  SUPPORTED_HTTP_VERBS.reduce((ops, verb) => {
    if (hasKey(pathItem, verb)) {
      ops[verb] = pathItem[verb]
    }
    return ops
  }, {})

const renderOperationMenuTab = (operationID, verb, operation, firstItem) => {
  const activeClass = firstItem ? 'active' : ''
  const tab = fromString('<li class="nav-item"></li>')
  const link = fromString(
    `<a class="nav-link ${activeClass}" id="${operationID}-tab" data-toggle="pill" href="#${operationID}" role="tab" aria-controls="${operationID}" aria-selected="${!!firstItem}">
      ${verb.toUpperCase()}
    </a>`
  )

  tab.appendChild(link)

  return tab
}

const renderOperationContentTab = (operationID, verb, operation, firstItem) => {
  const activeClass = firstItem ? 'show active' : ''

  const tab = fromString(
    `<div class="tab-pane fade ${activeClass}" id="${operationID}" role="tabpanel" aria-labelledby="${operationID}-tab"></div>`
  )
  const content = fromString(`<p>hello ${operationID}</p>`)

  tab.appendChild(content)

  return tab
}

const renderOperationsTabMenu = (linkRelID, pathItem, operations) => {
  const tabs = Object.keys(operations).map((verb, index) => {
    const operationID = `${linkRelID}-${verb}`

    return renderOperationMenuTab(
      operationID,
      verb,
      operations[verb],
      index === 0
    )
  })

  const tabMenuList = fromString(
    `<ul class="nav nav-pills mb-3" role="tablist" id="${linkRelID}-tab-menu"></ul>`
  )

  injectElements(tabMenuList, tabs)

  return tabMenuList
}

const renderOperationsTabContent = (linkRelID, pathItem, operations) => {
  const tabs = Object.keys(operations).map((verb, index) => {
    const operationID = `${linkRelID}-${verb}`

    return renderOperationContentTab(
      operationID,
      verb,
      operations[verb],
      index === 0
    )
  })

  const tabList = fromString(
    `<div class="tab-content" id="${linkRelID}-tab-content"></div>`
  )

  injectElements(tabList, tabs)

  return tabList
}

class OCPathOperations extends HTMLElement {
  constructor (linkRelID, pathItemRef, operations) {
    super()
    this.operations = operations
    this.linkRelID = linkRelID
    this.pathItemRef = pathItemRef
  }

  connectedCallback () {
    this.renderTabMenu()
    this.renderTabContent()

    this.tabLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()

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

  renderTabMenu () {
    this.tabMenu = renderOperationsTabMenu(
      this.linkRelID,
      this.pathItemRef,
      this.operations
    )

    this.appendChild(this.tabMenu)
  }

  renderTabContent () {
    this.tabContent = renderOperationsTabContent(
      this.linkRelID,
      this.pathItemRef,
      this.operations
    )

    this.appendChild(this.tabContent)
  }
}

customElements.define('oc-path-operations', OCPathOperations)

export const renderPathOperations = pathItem => {
  const linkRelID = ulid(pathItem['x-link-rel'])
  const operations = pathItemOperations(pathItem)

  const pathOperations = new OCPathOperations(linkRelID, pathItem, operations)

  return pathOperations
}
