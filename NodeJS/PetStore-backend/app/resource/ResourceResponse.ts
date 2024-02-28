import { camelCase, noCase } from 'change-case'

export default (resourceMap, responseOpt = {
  noForceCamel: false
}) => {
  const wrappedMap = (res, ...opt) => {
    const mappedData = resourceMap(res, ...opt)
    const camelMap = {}

    for (const key in mappedData) {
      let newKey = key
      if (!responseOpt || !responseOpt.noForceCamel) {
        newKey = camelCase(noCase(key))
      }

      camelMap[newKey] = mappedData[key]
    }
    return camelMap
  }

  return (res, ...opt) => {
    if (res === undefined || res === null) {
      return res
    } else if (Array.isArray(res)) {
      return res.map(i => wrappedMap(i, ...opt))
    }
    return wrappedMap(res, ...opt)

  }
}
