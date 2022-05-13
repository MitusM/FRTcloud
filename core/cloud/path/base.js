// const fs = require('fs')
import fs from 'fs'
// const mime = require('mime-types')
import mime from 'mime-types'
import pkg from 'app-root-path'
// const root = require('app-root-path').path
// const path = require('path')
import path from 'path'
// const util = require('../util/index')
import util from '../util/index.js'
const fsPromises = fs.promises
const root = pkg.path
// const shell = require('child_process').execSync
// const {
//     constants
// } = require('fs')

// TODO: [].slice.call(arg, 0) - Вынести в отдельный метод или util
class Base {
  constructor(options) {
    if (options) this.options = options
    this.root = root // options.root ||
    this.util = util
    this.fs = fsPromises
    this.path = path
    this.extImg = [
      '.bmp',
      '.cur',
      '.dds',
      '.gif',
      '.icns',
      '.ico',
      '.jpeg',
      '.jpg',
      '.png',
      '.jpg',
      '.ktx',
      '.pnm',
      '.pam',
      '.pbm',
      '.pfm',
      '.pgm',
      '.ppm',
      '.psd',
      '.svg',
      '.tiff',
      '.webp',
    ]
  }

  //* ?
  option(options) {
    this.options = options
    return this
  }

  /**
   * Перевод из относительного пути в абсолютный
   * @param {string} pathFiles относительный путь до файла.
   * @returns {string}
   */
  absolute(...segments) {
    const home = root.split('/')
    const arr = segments.length > 1 ? [...segments] : [...home, ...segments]
    const parts = arr.reduce((parts, segment) => {
      // Remove leading slashes from non-first part.
      if (parts.length > 0) {
        segment = segment.replace(/^\//, '')
      }
      // Remove trailing slashes.
      segment = segment.replace(/\/$/, '')
      return parts.concat(segment.split('/'))
    }, [])
    const resultParts = []
    for (const part of parts) {
      if (part === '.') {
        continue
      }
      if (part === '..') {
        resultParts.pop()
        continue
      }
      resultParts.push(part)
    }
    return resultParts.join('/')
  }

  /**
   * Проверяем являться путь абсолютным
   * @param {string} pathFiles путь до файла
   * @returns {boolean}
   */
  isAbsolute(...arg) {
    let argFolder = [].slice.call(arg, 0).join('')
    return new RegExp(this.root).test(argFolder)
  }

  /**
   * Проверяем относительный или абсолютный путь до файла. Если относительный то превращаем его в абсолютный.
   * @param  {...any} arg Абсолютный или относительный путь до файла
   * @returns {string}
   */
  resolve(...arg) {
    // normalizePath
    let argFolder = [].slice.call(arg, 0).join('')
    let abc = argFolder
    if (!this.isAbsolute(arg)) {
      abc = this.absolute(argFolder)
    }
    return abc
  }

  /**
   * Переименовать файл, папку
   * @param {string} path1 Относительный или абсолютный путь до файла или папки которую переименовываем
   * @param {*} path2 Относительный или абсолютный путь до файла или папки с новым именем
   * @returns {Promise} Если успешно Promise вернёт true, или error
   * @example:
   * - Переименовываем файл или папку.
   * await Base.rename({absolutePathFile}1.jpg, '../resize/new/123.jpg') // => true
   * - Перемещаем файл или папку в новое место с переименовыванием оригинала
   * await Base.rename({absolutePathFile}1.jpg, '../resize/new/123.jpg') // => true
   * - Перемещаем файл или папку в новое место с переименовыванием оригинала. Новое расположение относительного оригинального файла или папки
   * await Base.rename({absolutePathFile}1.jpg, '/resize/new/123.jpg') // => true
   */
  async rename(...args) {
    // FIXME: Вынести в отдельный метод src/path/base.js
    args = [].slice.call(arguments, 0)
    /**  */
    let path1 = this.resolve(args[0])
    /**  */
    let path2 = !path.isAbsolute(args[1])
      ? this.absolute(path.dirname(path1), args[1])
      : this.resolve(path.dirname(path1), args[1])
    /**  */
    this.mkDir(path.dirname(path2))

    try {
      await fsPromises.rename(path1, path2)
      return true
    } catch (err) {
      return err
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  // /**
  //  * Получаем имя и расширение файла
  //  * @param {string} file Путь до файлами
  //  * @returns {object} {ext, name}
  //  */
  // name(file) {
  //   const { ext, name } = path.parse(file)
  //   return { ext, name }
  // }

  // /**
  //  * Расширение файла
  //  * @param {string} file Путь до файла
  //  * @returns {string}
  //  */
  // extFile(file) {
  //   return path.extname(file)
  // }

  stat(...arg) {
    arg = [].slice.call(arg, 0)

    return fsPromises
      .stat(arg[0])
      .then((stats) => {
        let isFile = stats.isFile()
        let isDirectory = stats.isDirectory()

        const obj = {
          isFile: isFile,
          isDirectory: isDirectory,
          size: isFile ? this.formatBytes(stats.size) : stats.size, //
          bytes: stats.size,
          create: stats.birthtime, // время создания файла. Устанавливается один раз при создании файла. В файловых системах, где время рождения недоступно, это поле может вместо этого содержать либо ctime, либо 1970-01-01T00: 00Z (т.е. временную метку эпохи Unix 0). В этом случае это значение может быть больше, чем atime или mtime. В Darwin и других вариантах FreeBSD также устанавливается, если atime явно установлено на более раннее значение, чем текущее время рождения, с помощью системного вызова utimes(2).

          atime: stats.atime, // «Время доступа»: время последнего доступа к данным файла. Изменяется системными вызовами mknod(2), utimes(2) и read(2).

          ctime: stats.ctime, // «Время изменения»: время последнего изменения статуса файла (изменение данных inode). Изменено системными вызовами chmod(2), chown(2), link(2), mknod(2), rename(2), unlink(2), utimes(2), read(2) и write(2) .

          mtime: stats.mtime, // «Время изменения»: время последнего изменения данных файла. Изменяется системными вызовами mknod(2), utimes(2) и write(2).
        }

        return obj
      })
      .catch((err) => {
        return err
      })
  }

  async md5Checksum(file) {
    let fileBuffer = await fsPromises.readFile(file)
    return this.util.generateChecksum(fileBuffer)
  }

  extMimeTypes(ext) {
    return mime.lookup(ext)
  }
}

// module.exports = Base
export default Base
