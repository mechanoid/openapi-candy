/* global customElements, HTMLElement */

class TabbedContent extends HTMLElement {
  connectedCallback () {
    this.tabs = this.querySelectorAll('.oc-tabbed-content-tab')
    this.panels = this.querySelectorAll('.oc-tabbed-content-tab-panel')

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
}

customElements.define('oc-tabbed-content', TabbedContent)
