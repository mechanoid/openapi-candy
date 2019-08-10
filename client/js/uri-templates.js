/* global URI */

const apiResourceLinkTemplate = new URI.Template('/{?linkRel,spec}{#linkRelAsHash}')

export const apiResourceLink = params => apiResourceLinkTemplate.expand(Object.assign({}, params, { linkRelAsHash: params.linkRel }))
