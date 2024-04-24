import '../scss/index.scss'
import preloader from 'preloader-js'
// === === === === === === === === === === === ===
//
// === === === === === === === === === === === ===
;(async (window) => {
  /**  */
  preloader.hide()
  let Login = new _$.Form('login_form')
  let elements = Login._form.elements
  let token = elements[1]
  let consumer = elements[2]
  let user = elements[3]
  let password = elements[4]
  let submit = elements[5]
  let csrf = document
    .querySelector('meta[name=csrf-token]')
    .getAttributeNode('content').value
  token.value = csrf
  let message = (body) => {
    _$.message('error', {
      title: 'Ошибка',
      message: body,
      position: 'topCenter',
    })
  }

  submit.addEventListener('click', (e) => {
    e.preventDefault()
    preloader.show()
    let target = e.target
    let usrVal = user.value
    let pswVal = password.value
    let obj = {
      username: usrVal,
      csrf: token.value,
      password: pswVal,
    }

    if (usrVal === '') {
      validateFields(user, 'Укажите логин')
      user.focus()
    }
    if (pswVal === '') {
      validateFields(password, 'Укажите пароль')
      password.focus()
    }

    if (usrVal !== '' && pswVal !== '') {
      // submit.disabled = true;
      axios
        .post('/auth/signin', {
          username: usrVal,
          csrf: token.value,
          password: pswVal,
          consumer: consumer.value,
        })
        .then(function (response) {
          preloader.hide()
          let data = response.data
          if (data.status === 204 || data.status === 203) {
            message(data.message)
          }
          if (data.status === 200) {
            submit.disabled = true
            window.location.replace(data.location)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  })

  const validateFields = (field, body) => {
    // if (field === "") {
    message(body)
    field.focus()
    // }
  }
})(window)
