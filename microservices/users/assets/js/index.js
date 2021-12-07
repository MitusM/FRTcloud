import "../scss/index.scss";
import { nanoid } from "nanoid";
(async () => {
  let doc = document;
  doc.addEventListener("DOMContentLoaded", () => {
    /** url добавить пользователя */
    let urlUserAdd = doc.getElementById("url-user-add");
    /** контейнер с формой добавить пользователя */
    let divAddForm = doc.getElementById("user-add");
    /** форма добавить пользователя*/
    // let userAddForm = doc.querySelector(".user-form__add");
    /** кнопка закрыть форму добавления пользователя */
    let closeUserForm = doc.querySelector(".user-form-title__close");
    /** Таблица пользователей */
    let userTables = doc.querySelector(".user-table");
    /** class css display none  */
    let displayNone = "display-none";
    /**  */
    let formAdd = new _$.Form("user-form");
    /**  */
    let elements = formAdd._form.elements;
    /** Языковые константы при провале валидации */
    let langError = lang.errorAdmin;
    /**  */
    let userTableBody = userTables.children[1];
    /** Заголовок формы добавления или редактирования пользователя */
    let userFormTitle = document.querySelector(".user-form-add__title");

    /** LOGIN */
    let username = elements[1];
    let email = elements[2];
    let password = elements[3];
    let group = elements[4];
    let quota = elements[5];
    let submit = elements[6];

    console.log("⚡ userTables::", userTables);
    console.log("⚡ formAdd::", formAdd);
    console.log("⚡ userTableBody::", userTableBody);
    console.log("⚡ userFormTitle::", userFormTitle);

    let csrf = document
      .querySelector("meta[name=csrf-token]")
      .getAttributeNode("content").value;

    /**
     * Всплывающее сообщение.
     * @param {string} body Сообщение
     */
    let message = (action, body) => {
      _$.message(action, {
        title: action === "error" ? "Ошибка" : "Завершенное",
        message: body,
        position: "topCenter",
      });
    };

    /** Показываем или скрываем форму добавления пользователя */
    let toggleFormAdd = () => {
      divAddForm.classList.toggle(displayNone);
      divAddForm.classList.add("animate__zoomIn");
      if (userTables.classList.contains("animate__fadeOut")) {
        userTables.classList.remove("animate__fadeOut");
        userTables.classList.toggle("display-none");
      } else {
        userTables.classList.add("animate__fadeOut");
        userTables.classList.toggle("display-none");
      }
    };

    // console.log("⚡ submit::", submit);

    submit.addEventListener("click", (e) => {
      e.preventDefault();
      let user = username.value;
      let pass = password.value;
      // userFormTitle.textContent = "Добавить пользователя!";
      if (user === "") validateFields(username, langError.username);
      if (pass === "") validateFields(password, langError.password);
      if (user !== "" && pass !== "") {
        axios
          .post("/users/create", {
            username: user,
            email: email.value,
            password: pass,
            group: group.value,
            quota: quota.value,
            id: nanoid(),
            csrf: csrf,
          })
          .then((res) => {
            let data = res.data;
            let id;
            if (data.status === 200) {
              message("success", "Your account has been created");
              /** Скрываем форму добавления пользователя*/
              toggleFormAdd();
              /** Добавляем данные о пользователе в таблицу */
              userTableBody.insertAdjacentHTML("afterbegin", data.html);
              /** Находим id добавляемого элемента в таблицу для анимации */
              id = doc.getElementById(data.id);
              /** Добавляем class к элементу для анимации */
              id.classList.add("animate__zoomIn");
              /** Очищаем форму от данных */
              formAdd._form.reset();
            } else {
              message("error", data.message);
            }
          })
          .catch((err) => {
            console.log("⚡ err::", err);
          });
      }
    });

    /**
     * Показываем или скрываем форму добавления пользователя
     */
    urlUserAdd.addEventListener("click", (e) => {
      e.preventDefault();
      userFormTitle.textContent = "Добавить пользователя";
      toggleFormAdd();
    });

    /**
     * Скрываем форму добавления пользователя
     */
    closeUserForm.addEventListener("click", (e) => {
      toggleFormAdd();
    });

    /**  */
    const validateFields = (field, body) => {
      message("error", body);
      field.focus();
    };

    userTableBody.addEventListener("click", (e) => {
      let target = e.target;
      console.log("⚡ target::", target);
    });
  });
})();
