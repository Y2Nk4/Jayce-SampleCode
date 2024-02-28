import ResourceResponse from './ResourceResponse'

export default ResourceResponse((image) => {
  return {
    title: image.title,
    image_link: image.image_link,
    content_id: image.content_id,
    content_type: image.content_type,
  }
})
