export function attr(element, options) {
  this.each(options, (elem, key) => {
    if (key === 'class') {
      element.classList.add(options.class)
    } else {
      element.setAttribute(key, elem)
    }
  })
  return this
}

/**
 * Создаём объект с данными, на основании всех (data-*) атрибутов элемента
 * @param   {object}        e    элемент на котором произошло событие
 * @param   {string}        attr не обязательный параметр, если указан то будет получено значение только данного атрибута Например: name
 * @param   {*}             val  не обязательный параметр, если он указан вместе с параметром attr то у переданного атрибута будет установлено значение val
 * @returns {object|string} Если передан один первый параметр(e) то получим данные
 */
export function data(e, attr, val) {
  let element = e.target || e
  let data = !attr ? element.dataset : (!val ? element.dataset[attr] : element.dataset[attr] = val)
  return data
}