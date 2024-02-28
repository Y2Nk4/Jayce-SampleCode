import ResourceResponse from './ResourceResponse'

export default ResourceResponse(type => {
  return {
    id: type.id,
    name: type.name,
  }
})
