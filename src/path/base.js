const fs = require('fs')
const fsPromises = fs.promises
const shell = require('child_process').execSync
// const {
//     constants
// } = require('fs')

const root = require('app-root-path').path
const path = require('path')
const util = require('../util/index')

// TODO: [].slice.call(arg, 0) - Вынести в отдельный метод или util
class Base {
  constructor(options) {
    if (options) this.options = options
    this.root = root
    this.util = util
    this.fs = fs
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
    let home = root.split('/')
    const parts = [...home, ...segments].reduce((parts, segment) => {
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
    // return path.join(this.root, resultParts.join('/'))
  }

  /**
   * Проверяем являться путь абсолютным
   * @param {string} pathFiles путь до файла
   * @returns {boolean}
   */
  isAbsolute(...arg) {
    let argFolder = [].slice.call(arg, 0).join('')
    return new RegExp(this.root).test(argFolder)

    // return path.isAbsolute(pathFiles)
  }

  /**
   * Проверяем относительный или абсолютный путь до файла. Если относительный то превращаем его в абсолютный.
   * @param  {...any} arg Абсолютный или относительный путь до файла
   * @returns {string}
   */
  resolve(...arg) {
    let argFolder = [].slice.call(arg, 0).join('')
    // let testPathIsAbsolute = new RegExp(this.root).test(argFolder)
    let abc = argFolder
    if (!this.isAbsolute(arg)) {
      abc = this.absolute(argFolder)
    }
    return abc
  }

  /**
   * Переименовать файл, папку
   */
  rename(path1, path2) {
    // return new Promise((resolve, reject) => {
    //   fs.rename(path1, path2, (err) => {
    //     if (err) reject(err)
    //     resolve(path1, path2)
    //   })
    // })
    return fsPromises.rename(path1, path2)
  }

  stat() {

  }
}

module.exports = Base