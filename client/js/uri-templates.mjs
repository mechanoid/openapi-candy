/* global URI */

const apiResourceLinkTemplate = new URI.Template('/{?linkRel,spec}')

export const apiResourceLink = params => apiResourceLinkTemplate.expand(params)
