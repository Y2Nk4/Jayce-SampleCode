import { Controller } from 'egg'
import * as fileMd5 from 'md5-file'

export default class FileAssetManageController extends Controller {
  async uploadFile() {
    const { ctx, app } = this

    try {
      let queue = Promise.resolve()
      // 遍历处理多个文件
      for (const file of ctx.request.files) {
        queue = queue.then(async () => {
          const md5 = await fileMd5(file.filepath)
          console.log(md5, app)
          // app.appService.storage.saveFileFromPath(file.filepath)
          await app.model.FileInfo.create({
            file_name: file.filename,
            file_md5: md5
          })
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
}
