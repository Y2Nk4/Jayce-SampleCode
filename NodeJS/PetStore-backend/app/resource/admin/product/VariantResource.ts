import ResourceResponse from '../../ResourceResponse'
import CamelCaseResource from '../../common/CamelCaseResource'

export default ResourceResponse((variant) => {
  const camelVariant = CamelCaseResource(variant)
  return camelVariant
})
