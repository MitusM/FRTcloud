import dotenv from 'dotenv'
import { uploadFile } from '../core/upload/index.js'

dotenv.config()

const endpoints = async (app) => {
  /**
   * Загрузка файлов.
   */
  app.post('/upload/:microservice-:upload(.*)', async (req, res) => {
    try {
      // FIXME: добавить проверку csrfSecret
      if (req.session.auth === true) {
        let microservice = req.params.microservice
        let mi = req.params.upload
        let options = {
          upload: true,
          path: process.env.UPLOAD_DIR + microservice + '/' + mi + '/original/',
          resize:
            process.env.UPLOAD_DIR +
            microservice +
            '/' +
            mi +
            process.env.UPLOAD_RESIZE,
          basename: true,
          limits: {
            fileSize: process.env.UPLOAD_FILESIZE,
          },
          mimeTypeLimit: process.env.UPLOAD_MIMETYPE.split(','),
        }

        req.body = await uploadFile(req, options)
        await res.delegate(microservice)
      } else {
        await res.status(403).end({
          message: 'Unauthorized',
        })
      }
    } catch (err) {
      console.log('⚡ err::upload', err)
    }
  })
  app.all('/:microservice/(.*)', async (req, res) => {
    await res.delegate(req.params.microservice)
  })
  return app
}

export { endpoints }
