/** 
 * 
 * 
 */
class Form {
  constructor(selector, option) {
    this._form = typeof (selector) === 'string' ? document.forms[selector] : (typeof (selector) === 'object' ? selector : null)
  }
}

export default Form;