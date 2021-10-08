const fs = require('fs')
const {
  constants
} = require('fs')


const Dir = require('./dir')

// ✨ 📌
class Files extends Dir {
  constructor(options) {
    super(options)
  }

  /**
   * Получаем имя и расширение файла
   * @param {string} file Путь до файлами
   * @returns {object} {ext, name}
   */
  name(file) {
    const {
      ext,
      name
    } = this.path.parse(file)
    return {
      ext,
      name
    }
  }

  /**
   * Расширение файла
   * @param {string} file Путь до файла
   * @returns {string}
   */
  extFile(file) {
    return this.path.extname(file)
  }


  /**
   * Проверка существования файла, а так же проверка на то что он не занят другими процессами
   * @param {string} path Абсолютный путь до файлами
   * @returns {Promise} Promise object true - объект существует и доступен false - объекта не существует или он занят другими процессами
   */
  isExists(path) {
    // await fsPromises.access(saveTo, constants.F_OK | constants.R_).then((access) => true).catch((err) => false)
    return new Promise((resolve, reject) => {
      fs.access(path, constants.F_OK | constants.R_OK, err => {
        if (!err) return resolve(true);
        if (err.code === 'ENOENT') return resolve(false);
        reject(err);
      });
    });
  }

  /**
   * Проверка является ли файлом
   * @param {string} path Путь до файла
   * @returns {boolean}
   */
  isFile(path) {
    path = this.resolve(path);
    return this.fs.stat(path).then(stat => stat.isFile())
  }

  /**
   * Размер файла
   * @param {string} path Путь до файла
   * @returns {string}
   */
  size(path) {
    path = this.resolve(path);
    return this.fs.stat(path).then(stat => this.formatBytes(stat.size))
  }

  /**
   * Удаление файла
   * @param {string} file Абсолютный путь до файла
   * @returns {Promise}
   */
  async delete(file) {
    const isFileExt = await this.isExists(file)
    return new Promise((resolve, reject) => {
      if (isFileExt) {
        fs.unlink(file, (err) => {
          if (err) {
            reject({
              ok: false,
              error: err
            })
          } else {
            resolve(true)
          }
        })
      } else {
        reject(false)
      }

    })
  }

  /**
   * Удаление массива файлов.
   * @param {array} arr Массив с файлами. Каждый путь до файла должен быть абсолютным
   * @returns {boolean|Promise} true - Все файлы удалены успешно 
   */
  deleteArrayFiles(arr) {
    let arrPromise = []
    let length = arr.length
    for (let i = 0; i < length; i++) {
      let file = this.absolute(arr[i])
      arrPromise.push(this.delete(file))
    }
    return Promise.all(arrPromise).then(del => del.every(bool => bool === true)).catch(error => error)
  }




}

module.exports = Files