import ResourceResponse from './ResourceResponse'

export default ResourceResponse(type => {
  return {
    id: type.id,
    description: type.description,
    name: type.name,
    thumbnail: type.thumbnail,
  }
})
