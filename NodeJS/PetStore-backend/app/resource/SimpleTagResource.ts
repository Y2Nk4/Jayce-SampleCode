import ResourceResponse from './ResourceResponse'

export default ResourceResponse(tag => {
  return {
    id: tag.id,
    name: tag.name,
    custom_link: tag.custom_link,
  }
})
