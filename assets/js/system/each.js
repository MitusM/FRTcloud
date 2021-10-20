export function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

const nativeForEach = Array.prototype.forEach
const breaker = {}

export function each (obj, iterator, context) {
  if (obj == null) return
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context)
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker) return
    }
  } else {
    for (var key in obj) {
      if (has(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) return
      }
    }
  }
}
