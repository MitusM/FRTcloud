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
    let userAddForm = doc.querySelector(".user-form__add");
    /** кнопка закрыть форму добавления пользователя */
    let closeUserForm = doc.querySelector(".user-form-title__close");
    /** Таблица пользователей */
    let userTables = doc.querySelector(".user-table");
    /** class css display none  */
    let displayNone = "display-none";
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
    /**  */
    let formAdd = new _$.Form("user-form");
    /**  */
    let elements = formAdd._form.elements;
    console.log("⚡ formAdd::", formAdd);
    console.log("⚡ elements::", elements);
    /** LOGIN */
    let username = elements[1];
    let email = elements[2];
    let password = elements[3];
    let group = elements[4];
    let quota = elements[5];

    /**
     *
     */
    urlUserAdd.addEventListener("click", (e) => {
      e.preventDefault();
      toggleFormAdd();
    });

    /**
     *
     */
    closeUserForm.addEventListener("click", (e) => {
      toggleFormAdd();
    });
    console.log("⚡ nanoid::", nanoid());
  });
})();
