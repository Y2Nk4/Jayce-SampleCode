import ResourceResponse from '../ResourceResponse'
import { camelCase, noCase } from 'change-case'

export default ResourceResponse((object, opt) => {
  const temp = {}
  Object.keys(JSON.parse(JSON.stringify(object))).forEach(key => {
    if (opt && opt.ignore && Array.isArray(opt.ignore) && opt.ignore.includes(key)) {
      temp[key] = object[key]
    } else {
      temp[camelCase(noCase(key))] = object[key]
    }
  })
  return temp
}, { noForceCamel: true })
