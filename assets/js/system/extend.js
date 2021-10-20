let extend = function () {
  let merged = {}
  Array.prototype.forEach.call(arguments, function (obj) {
    for (let key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (!obj.hasOwnProperty(key)) return
      merged[key] = obj[key]
    }
  })
  return merged
}

export {extend}