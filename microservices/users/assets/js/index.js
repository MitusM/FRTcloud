import '../scss/index.scss'
import { nanoid } from 'nanoid'
;(async () => {
  let doc = document
  doc.addEventListener('DOMContentLoaded', () => {
    /** url добавить пользователя */
    let urlUserAdd = doc.getElementById('url-user-add')
    /** контейнер с формой добавить пользователя */
    let divAddForm = doc.getElementById('user-add')
    /** форма добавить пользователя*/
    // let userAddForm = doc.querySelector(".user-form__add");
    /** кнопка закрыть форму добавления пользователя */
    let closeUserForm = doc.querySelector('.user-form-title__close')
    /** Таблица пользователей */
    let userTables = doc.querySelector('.user-table')
    /** class css display none  */
    let displayNone = 'display-none'
    /**  */
    let formAdd = new _$.Form('user-form')
    /**  */
    let elements = formAdd._form.elements
    /** Языковые константы при провале валидации */
    let langError = lang.errorAdmin
    /**  */
    let userTableBody = userTables.children[1]
    /** Заголовок формы добавления или редактирования пользователя */
    let userFormTitle = document.querySelector('.user-form-add__title')

    /** Элементы формы добавления или редактирования пользователя */
    let hidden = elements[0]
    let _id = elements[1]
    let username = elements[3]
    let email = elements[4]
    let password = elements[5]
    let group = elements[6]
    let quota = elements[7]
    let submit = elements[8]

    let rid

    // console.log('⚡ elements::', elements)
    // console.log("⚡ userTables::", userTables);
    // console.log('⚡ formAdd::', formAdd)
    // console.log("⚡ userTableBody::", userTableBody);
    // console.log("⚡ userFormTitle::", userFormTitle);

    let csrf = document
      .querySelector('meta[name=csrf-token]')
      .getAttributeNode('content').value

    /**
     * Всплывающее сообщение.
     * @param {string} body Сообщение
     */
    let message = (action, body) => {
      _$.message(action, {
        title: action === 'error' ? 'Ошибка' : 'Завершенное',
        message: body,
        position: 'topCenter',
      })
    }

    /** Показываем или скрываем форму добавления пользователя */
    let toggleFormAdd = () => {
      divAddForm.classList.toggle(displayNone)
      divAddForm.classList.add('animate__zoomIn')
      formAdd._form.reset()
      if (userTables.classList.contains('animate__fadeOut')) {
        userTables.classList.remove('animate__fadeOut')
        userTables.classList.toggle('display-none')
      } else {
        userTables.classList.add('animate__fadeOut')
        userTables.classList.toggle('display-none')
      }
    }

    /** This function is called when the form is submitted*/
    submit.addEventListener('click', (e) => {
      e.preventDefault()
      return hidden.value === 'add' ? add() : update()
    })

    /**
     * Показываем или скрываем форму добавления пользователя
     */
    urlUserAdd.addEventListener('click', (e) => {
      e.preventDefault()
      userFormTitle.textContent = 'Добавить пользователя'
      hidden.value = 'add'
      toggleFormAdd()
    })

    /**
     * Скрываем форму добавления пользователя
     */
    closeUserForm.addEventListener('click', (e) => {
      toggleFormAdd()
    })

    /**  */
    const validateFields = (field, body) => {
      message('error', body)
      field.focus()
    }

    let update = () => {
      let user = username.value,
        emailUpdated = email.value //,
      // pass = password.value //,
      // obj = { _id: _id.value, csrf: csrf, rid: rid }
      console.log('⚡ user && email::', user && emailUpdated)
      if (user === '') validateFields(username, langError.username)
      if (user && email) {
        if (user)
          axios
            .post('/users/update', {
              username: user,
              email: emailUpdated,
              password: password.value,
              group: group.value,
              quota: quota.value,
              id: _id.value,
              csrf: csrf,
              rid: rid,
            })
            .then((res) => {
              console.log('⚡ res::', res)
              // rid = ''
              console.log('⚡ rid::', rid)
            })
            .catch((err) => console.error(err))
      }
    }

    let add = () => {
      let user = username.value,
        pass = password.value
      if (user === '') validateFields(username, langError.username)
      if (pass === '') validateFields(password, langError.password)
      if (user !== '' && pass !== '') {
        axios
          .post('/users/create', {
            // target: hidden.value,
            username: user,
            email: email.value,
            password: pass,
            group: group.value,
            quota: quota.value,
            id: nanoid(),
            csrf: csrf,
          })
          .then((res) => {
            let data = res.data
            let id
            if (data.status === 200) {
              message('success', 'Your account has been created')
              /** Скрываем форму добавления пользователя*/
              toggleFormAdd()
              /** Добавляем данные о пользователе в таблицу */
              userTableBody.insertAdjacentHTML('afterbegin', data.html)
              /** Находим id добавляемого элемента в таблицу для анимации */
              id = doc.getElementById(data.id)
              /** Добавляем class к элементу для анимации */
              id.classList.add('animate__zoomIn')
              /** Очищаем форму от данных */
              // formAdd._form.reset()
            } else {
              message('error', data.message)
            }
          })
          .catch((err) => {
            console.log('⚡ err::', err)
          })
      }
    }

    /** Редактирование данных пользователя */
    const editUser = (user) => {
      console.log('⚡ user::', user)
      userFormTitle.textContent = 'Редактировать пользователя'
      toggleFormAdd()
      hidden.value = 'update'
      _id.value = user._id
      username.value = user.username
      email.value = user.email
      quota.value = _$.gb(user.quota)
      group.value = user.group

      rid = user.rid

      // console.log('⚡ user.quota::', user.quota)
      // console.log('⚡ _$.gb(user.quota)::', _$.gb(user.quota))
      // console.log('⚡ user._id::', user._id)
    }

    /** Удаляем пользователя */
    const deleteUser = (user) => {
      // user = JSON.parse(user)
    }

    /** Блокируем или разблокируем пользователя */
    const userBan = (user) => {
      // user = JSON.parse(user)
    }

    userTableBody.addEventListener('click', (e) => {
      let target = e.target
      let task = target.dataset['target']
      let id = target.dataset['id']
      let user = JSON.parse(target.dataset['user'])
      switch (task) {
        case 'edit':
          editUser(user)
          break
        case 'delete':
          deleteUser(user)
          break
        case 'ban':
          userBan(user)
          break
      }
      // console.log('⚡ target::', target)
      // console.log('⚡ task::', task)
    })
  })
})()
