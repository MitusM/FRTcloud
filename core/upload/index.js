import { createRequire } from 'module'
import fs from 'fs'
import os from 'os'
import path from 'path'
import Busboy from 'busboy'
import { constants } from 'fs'

import { mkDir } from './mkDir.js'

// console.log('⚡ path::', path)

const require = createRequire(import.meta.url)
const fsPromises = fs.promises
const config = require('./config/upload.json')
/** Директория в которою происходит сохранение файла. Если не установлена то будет использована временная директория системы*/
let saveToFile
/** Массив из MIME-типов данных разрешённых к загрузке */
let mimeTypeLimit
/** true загрузить файлы, false загрузка не будет осуществлена. Выведены будут данные других полей */
let upload

let readStream

const getDescriptor = Object.getOwnPropertyDescriptor
let uploadFile = (req, options) => {
  return new Promise((resolve, reject) => {
    // console.log('⚡ req::', req)
    //
    /**  */
    options = typeof options === 'string' ? config[options] : options
    console.log('⚡ options::', options)
    // console.log('⚡ config::', config)

    /** Функция загрузки файла, заменяющая функцию загрузки файла по умолчанию */
    const customOnFile =
      typeof options.onFile === 'function' ? options.onFile : false

    let headers = options.headers || req.headers
    // header = Object.keys(headers).reduce((newHeaders, key) => {
    //   console.log('⚡ key::', key)
    //   console.log('⚡ key.toLowerCase()::', key.toLowerCase())
    //   newHeaders[key.toLowerCase()] = headers[key]
    //   return newHeaders
    // }, {})
    // console.log('⚡ header::', headers)
    saveToFile = options.path || os.tmpdir()

    mimeTypeLimit = options.mimeTypeLimit
      ? !Array.isArray(options.mimeTypeLimit)
        ? [options.mimeTypeLimit]
        : options.mimeTypeLimit
      : null

    upload = options.upload || false
    console.log('⚡ upload::', upload)

    readStream = options.readStream || false
    // console.log('⚡ headers::', headers)
    var busboy = Busboy({
      headers: headers,
    })
    // console.log('⚡ busboy::', busboy)
    // console.log('⚡ Busboy::', Busboy())
    const fields = {}
    const filePromises = []

    busboy
      .on('file', onFile.bind(null, filePromises))
      .on('field', onField.bind(null, fields))
      .on('end', onEnd)
      .on('close', onEnd)
      .on('error', onError)
      .on('finish', onEnd)

    busboy.on('partsLimit', function () {
      const err = new Error('Reach parts limit')
      err.code = 'Request_parts_limit'
      err.status = 413
      onError(err)
    })

    busboy.on('filesLimit', () => {
      const err = new Error('Reach files limit')
      err.code = 'Request_files_limit'
      err.status = 413
      onError(err)
    })

    busboy.on('fieldsLimit', () => {
      const err = new Error('Reach fields limit')
      err.code = 'Request_fields_limit'
      err.status = 413
      onError(err)
    })

    req.pipe(busboy)

    /**  */
    function onEnd(err) {
      /** Срабатывает когда файл загружен */
      if (err) {
        return reject(err)
      }
      if (customOnFile) {
        cleanup()
        resolve({
          fields,
        })
      } else {
        Promise.all(filePromises)
          .then((files) => {
            cleanup()
            resolve({
              fields,
              files,
            })
          })
          .then((obj) => obj)
          .catch(reject)
      }
      // })
    }

    function onError(err) {
      cleanup()
      return reject(err)
    }

    function cleanup() {
      busboy.removeListener('field', onField)
      busboy.removeListener('file', customOnFile || onFile)
      busboy.removeListener('end', cleanup)
      busboy.removeListener('close', cleanup)
      busboy.removeListener('close', cleanup)
      busboy.removeListener('error', onEnd)
      busboy.removeListener('partsLimit', onEnd)
      busboy.removeListener('filesLimit', onEnd)
      busboy.removeListener('fieldsLimit', onEnd)
      busboy.removeListener('finish', onEnd)
    }

    /**  */
    async function onFile(
      filePromises,
      fieldname,
      file,
      filename,
      encoding,
      mimetype,
    ) {
      console.log('==============================')
      let csrf = req.session.csrfSecret
      console.log('⚡ csrf::', csrf)
      if (csrf === fields.csrf) {
        let newName
        /** Создаём новое уникальное имя файлу, если options.basename: false */
        console.log('⚡ options.basename::', options.basename)
        if (options.basename) {
          newName = file.tmpName = filename
        } else {
          newName = file.tmpName =
            Math.random().toString(16).substring(2) + '-' + filename
          console.log('⚡ newName::.', newName.filename)
        }

        /** Папка в которую сохраняем файл. Если она не существует то она будет создана */
        // let join = path.join(process.cwd(), saveToFile)
        mkDir(path.join(process.cwd(), saveToFile))
        /** относительный путь до файла */
        let relativePath = path.join(saveToFile, newName.filename)
        /** абсолютный путь к файлу */
        let saveTo = path.join(process.cwd(), relativePath)

        let access = await fsPromises
          .access(saveTo, constants.F_OK | constants.R_)
          .then((access) => true)
          .catch((err) => false)

        if (access) {
          let { name, ext } = path.parse(saveTo)
          newName = `${name}-${Math.random().toString(36).substring(2)}${ext}`
          saveTo = path.join(process.cwd(), saveToFile, newName.filename)
        }

        // Create a write stream of the new file
        const writeStream = fs.createWriteStream(saveTo, {
          mode: '644',
        })

        console.log('⚡ newName::', newName)

        const filePromise = new Promise((resolve, reject) =>
          writeStream
            .on('open', () =>
              file
                .pipe(writeStream)
                .on('error', reject)
                .on('finish', () => {
                  if (readStream) {
                    const readStream = fs.createReadStream(saveTo)
                    readStream.fieldname = fieldname
                    readStream.filename = filename
                    readStream.transferEncoding = readStream.encoding = encoding
                    readStream.mimeType = readStream.mime = mimetype
                    resolve(readStream)
                  } else {
                    const stream = {
                      fieldname: fieldname,
                      path: relativePath,
                      isAbsolute: saveTo,
                      folder: saveToFile,
                      basename: filename.mimeType,
                      mimeType: filename.mimeType,
                      encoding: filename.encoding,
                      newName: newName.filename,
                    }
                    resolve(stream)
                  }
                }),
            )
            .on('error', (err) => {
              file.resume().on('error', reject)
              reject(err)
            }),
        )
        filePromises.push(filePromise)
      } else {
        new Error('Доступ к загрузке запрещён')
      }
    }

    function onField(fields, name, val) {
      if (getDescriptor(Object.prototype, name)) return
      // This looks like a stringified array, let's parse it
      if (name.indexOf('[') > -1) {
        const obj = objectFromBluePrint(extractFormData(name), val)
        reconcile(obj, fields)
      } else {
        if (fields.hasOwnProperty(name)) {
          if (Array.isArray(fields[name])) {
            fields[name].push(val)
          } else {
            fields[name] = [fields[name], val]
          }
        } else {
          fields[name] = val
        }
      }
    }

    /**
     *
     * Extract a hierarchy array from a stringified formData single input.
     *
     *
     * i.e. topLevel[sub1][sub2] => [topLevel, sub1, sub2]
     *
     * @param  {String} string: Stringify representation of a formData Object
     * @private
     * @return {Array}
     *
     */
    const extractFormData = (string) => {
      const arr = string.split('[')
      const first = arr.shift()
      const res = arr.map((v) => v.split(']')[0])
      res.unshift(first)
      return res
    }

    /**
     *
     * Generate an object given an hierarchy blueprint and the value
     *
     * i.e. [key1, key2, key3] => { key1: {key2: { key3: value }}};
     *
     * @param  {Array} arr:   from extractFormData
     * @param  {[type]} value: The actual value for this key
     * @return {[type]}       [description]
     * @private
     *
     */
    const objectFromBluePrint = (arr, value) => {
      return arr.reverse().reduce((acc, next) => {
        if (Number(next).toString() === 'NaN') {
          return {
            [next]: acc,
          }
        } else {
          const newAcc = []
          newAcc[Number(next)] = acc
          return newAcc
        }
      }, value)
    }

    /**
     * Reconciles formatted data with already formatted data
     *
     * @param  {Object} obj extracted Object
     * @param  {Object} target the field object
     * @return {Object} reconciled fields
     * @private
     *
     */
    const reconcile = (obj, target) => {
      const key = Object.keys(obj)[0]
      const val = obj[key]

      // The reconciliation works even with array has
      // Object.keys will yield the array indexes
      // see https://jsbin.com/hulekomopo/1/
      // Since array are in form of [ , , valu3] [value1, value2]
      // the final array will be: [value1, value2, value3] has expected
      if (target.hasOwnProperty(key)) {
        return reconcile(val, target[key])
      } else {
        return (target[key] = val)
      }
    }
  })

  // // return new Promise((resolve, reject) => {
  // console.log('⚡ config::', config)
  // /** Директория в которою происходит сохранение файла. Если не установлена то будет использована временная директория системы*/
  // let saveToFile
  // //   console.log('⚡ busboy::', busboy)
  // // console.log('⚡ req.headers::', req.headers)
  // let headers = options.headers || req.headers
  // // console.log('⚡ headers::', headers)
  // // console.log('⚡ req.headers::', req.headers['content-type'])
  // var busboy = Busboy({ headers: req.headers })
  // // console.log('⚡ busboy::', busboy)
  // busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
  //   console.log(
  //     'File [' +
  //       fieldname +
  //       ']: filename: ' +
  //       filename +
  //       ', encoding: ' +
  //       encoding +
  //       ', mimetype: ' +
  //       mimetype,
  //   )
  //   file.on('data', function (data) {
  //     console.log('File [' + fieldname + '] got ' + data.length + ' bytes')
  //   })
  //   file.on('end', function () {
  //     console.log('File [' + fieldname + '] Finished')
  //   })
  // })
  // busboy.on(
  //   'field',
  //   function (
  //     fieldname,
  //     val,
  //     fieldnameTruncated,
  //     valTruncated,
  //     encoding,
  //     mimetype,
  //   ) {
  //     console.log('⚡ fieldname::', fieldname)
  //   },
  // )
  // busboy.on('finish', function () {
  //   console.log('Done parsing form!')
  // })
  // req.pipe(busboy)
  // // const bb = new busboy({ headers: headers })
  // // const fields = {}
  // // const filePromises = []
  // // // bb.on('file', onFile)
  // // bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
  // //   console.log(fieldname, file, filename, encoding, mimetype)
  // //   // const filepath = path.join(os.tmpdir(), filename)
  // //   // uploadData = { file: filepath, type: mimetype }
  // //   // file.pipe(fs.createWriteStream(filepath))
  // // })
  // // bb.on('finish', (err) => {
  // //   console.log('⚡ finish::', err)
  // //   // const bucket = gcs.bucket('meeting-scheduler-9cee1.appspot.com')
  // //   // bucket
  // //   //   .upload(uploadData.file, {
  // //   //     uploadType: 'media',
  // //   //     metadata: {
  // //   //       metadata: {
  // //   //         contentType: uploadData.type,
  // //   //       },
  // //   //     },
  // //   //   })
  // //   //   .then(() => {
  // //   //     response.status(200).json({
  // //   //       message: 'It Works!',
  // //   //     })
  // //   //   })
  // //   //   .catch((err) => {
  // //   //     response.status(500).json({
  // //   //       error: err,
  // //   //     })
  // //   //   })
  // // })
  // // bb.on('field', onField)
  // // bb.on('error', onError)
  // // // bb.on('finish', onEnd)
  // // bb.on('end', onEnd)
  // // bb.on('close', cleanup)
  // // req.pipe(bb)
  // function onField(fields, name, val) {
  //   console.log('⚡ fields, name, val::', fields, name, val)
  //   if (getDescriptor(Object.prototype, name)) return
  //   // This looks like a stringified array, let's parse it
  //   if (name.indexOf('[') > -1) {
  //     const obj = objectFromBluePrint(extractFormData(name), val)
  //     reconcile(obj, fields)
  //   } else {
  //     if (fields.hasOwnProperty(name)) {
  //       if (Array.isArray(fields[name])) {
  //         fields[name].push(val)
  //       } else {
  //         fields[name] = [fields[name], val]
  //       }
  //     } else {
  //       fields[name] = val
  //     }
  //   }
  // }
  // function onError(err) {
  //   console.log('⚡ err::', err)
  // }
  // function cleanup() {
  //   console.log('⚡ cleanup')
  // }
  // function onEnd(err) {
  //   console.log('⚡ err::onEnd', err)
  //   /** Срабатывает когда файл загружен */
  //   // if (err) {
  //   //   return reject(err)
  //   // }
  //   // if (customOnFile) {
  //   //   cleanup()
  //   //   resolve({
  //   //     fields,
  //   //   })
  //   // } else {
  //   //   Promise.all(filePromises)
  //   //     .then((files) => {
  //   //       cleanup()
  //   //       resolve({
  //   //         fields,
  //   //         files,
  //   //       })
  //   //     })
  //   //     .then((obj) => obj)
  //   //     .catch(reject)
  //   // }
  //   // })
  // }
  // function onFile(name, file, info) {
  //   console.log('⚡ name::', name)
  //   console.log(file, info)
  // }
  // /**
  //  *
  //  * Extract a hierarchy array from a stringified formData single input.
  //  *
  //  *
  //  * i.e. topLevel[sub1][sub2] => [topLevel, sub1, sub2]
  //  *
  //  * @param  {String} string: Stringify representation of a formData Object
  //  * @private
  //  * @return {Array}
  //  *
  //  */
  // const extractFormData = (string) => {
  //   const arr = string.split('[')
  //   const first = arr.shift()
  //   const res = arr.map((v) => v.split(']')[0])
  //   res.unshift(first)
  //   return res
  // }
  // /**
  //  *
  //  * Generate an object given an hierarchy blueprint and the value
  //  *
  //  * i.e. [key1, key2, key3] => { key1: {key2: { key3: value }}};
  //  *
  //  * @param  {Array} arr:   from extractFormData
  //  * @param  {[type]} value: The actual value for this key
  //  * @return {[type]}       [description]
  //  * @private
  //  *
  //  */
  // const objectFromBluePrint = (arr, value) => {
  //   return arr.reverse().reduce((acc, next) => {
  //     if (Number(next).toString() === 'NaN') {
  //       return {
  //         [next]: acc,
  //       }
  //     } else {
  //       const newAcc = []
  //       newAcc[Number(next)] = acc
  //       return newAcc
  //     }
  //   }, value)
  // }
  // /**
  //  * Reconciles formatted data with already formatted data
  //  *
  //  * @param  {Object} obj extracted Object
  //  * @param  {Object} target the field object
  //  * @return {Object} reconciled fields
  //  * @private
  //  *
  //  */
  // const reconcile = (obj, target) => {
  //   const key = Object.keys(obj)[0]
  //   const val = obj[key]
  //   // The reconciliation works even with array has
  //   // Object.keys will yield the array indexes
  //   // see https://jsbin.com/hulekomopo/1/
  //   // Since array are in form of [ , , valu3] [value1, value2]
  //   // the final array will be: [value1, value2, value3] has expected
  //   if (target.hasOwnProperty(key)) {
  //     return reconcile(val, target[key])
  //   } else {
  //     return (target[key] = val)
  //   }
  // }
  // }) Promise
}

export { uploadFile }
