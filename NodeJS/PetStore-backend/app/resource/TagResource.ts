import ResourceResponse from './ResourceResponse'

export default ResourceResponse(tag => {
  return {
    id: tag.id,
    name: tag.name,
    custom_link: tag.custom_link,
    description: tag.description,
    thumbnail: tag.thumbnail,
    page_theme_color: tag.page_theme_color,
  }
})
