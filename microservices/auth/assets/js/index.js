import "../scss/index.scss";

(async (window) => {
  let Login = new _$.Form("login_form");
  let elements = Login._form.elements;
  let token = elements[1];
  let consumer = elements[2];
  let user = elements[3];
  let password = elements[4];
  let submit = elements[5];
  let csrf = document
    .querySelector("meta[name=csrf-token]")
    .getAttributeNode("content").value;
  token.value = csrf;
  let message = (body) => {
    _$.message("error", {
      title: "Ошибка",
      message: body,
      position: "topCenter",
    });
  };

  submit.addEventListener("click", (e) => {
    e.preventDefault();
    let target = e.target;
    let usrVal = user.value;
    let pswVal = password.value;
    let obj = {
      username: usrVal,
      csrf: token.value,
      password: pswVal,
    };

    if (usrVal === "") {
      validateFields(usrVal, "Укажите логин");
      user.focus();
    }
    if (pswVal === "") {
      validateFields(pswVal, "Укажите пароль");
      password.focus();
    }

    if (usrVal !== "" && pswVal !== "") {
      // submit.disabled = true;
      axios
        .post("/auth/signin", {
          username: usrVal,
          csrf: token.value,
          password: pswVal,
          consumer: consumer.value,
        })
        .then(function (response) {
          let data = response.data;
          if (response.status === 200) {
            window.location.href = response.data;
          } else {
            message(data.message);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });

  const validateFields = (field, message) => {
    if (field === "") {
      message(message);
    }
  };
})(window);
