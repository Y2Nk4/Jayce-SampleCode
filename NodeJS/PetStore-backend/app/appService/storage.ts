// import * as fsp from 'fs/promises'
import * as path from 'path'

export default class Storage {
  readonly rootPath: string = path.resolve(__dirname, '../../storage')

  constructor() {
    // @ts-ignore
    this.rootPath = path.dirname(require.main.filename)
    console.log(this.rootPath)
  }

  async saveFileFromPath(filepath: string, newPath: string) {
    const pathInfo = path.parse(filepath)
    console.log(pathInfo, newPath)
    // await fsp.copyFile()
  }
}
