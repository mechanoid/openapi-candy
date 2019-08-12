/* global customElements, HTMLElement */

class TabbedContent extends HTMLElement {
  connectedCallback () {
    this.tabs = this.querySelectorAll(this.tabSelector)
    this.panels = this.querySelectorAll(this.panelSelector)

    console.log(this.panels)

    this.tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault()
        this.tabs.forEach(tab => tab.classList.remove('active'))
        this.panels.forEach(panel => panel.classList.remove('active'))

        const target = tab.getAttribute('data-target')
        const selectedPanel = this.querySelector(`[data-content="${target}"]`)
        tab.classList.add('active')
        selectedPanel.classList.add('active')
      })
    })
  }

  get tabSelector () {
    return this.getAttribute('tab-selector') || '.oc-tabbed-content-tab'
  }

  get panelSelector () {
    return this.getAttribute('panel-selector') || '.oc-tabbed-content-tab-panel'
  }
}

customElements.define('oc-tabbed-content', TabbedContent)
