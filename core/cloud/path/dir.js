const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const FileHound = require('filehound')
copy = require('recursive-copy')

const Base = require('./base')
const {
  async
} = require('regenerator-runtime')


class Dir extends Base {
  constructor(options) {
    super(options)
  }

  create(path) {
    // this.dir = path
    return FileHound.create()
  }

  directory(path, depth = 0) {
    path = this.resolve(path)
    return FileHound.create().paths(path).depth(depth).directory().find()
  }

  files(path, depth = 0) {
    path = this.resolve(path)
    return this.create()
      .paths(path)
      .depth(depth)
      // .ignoreHiddenDirectories()
      .find()
  }

  /** Recursively copy files and folders from src to dest */
  dirCopy(src, dest, options) {

  }

  mkDir(targetDir, {
    isRelativeToScript = false
  } = {}) {
    const sep = path.sep
    const initDir = path.isAbsolute(targetDir) ? sep : ''
    const baseDir = isRelativeToScript ? __dirname : '.'

    return targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code === 'EEXIST') { // curDir already exists!
          return curDir;
        }

        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
        if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
          //! TODO:
          throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
        }

        const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
        if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
          throw err; // Throw if it's just the last created dir.
        }
      }

      return curDir;
    }, initDir)
  }

  isDirectory(dir) {
    dir = this.resolve(dir)
    return this.fs.stat(dir).then(stat => stat.isDirectory())
  }

}

module.exports = Dir