$(document).ready(function () {
  $("#btn-login").click(function () {
    dealLogin();
  });

  $("#form-login").on("keydown", function (event) {
    if (event.key === "Enter" && $(event.target).is("input")) {
      dealLogin();
    }
  });
});

function dealLogin() {
  if (isValidLogin()) {
    login();
  }
}

function login() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/user/login`,
    data: $("#form-login").serialize(),
    headers: {
      "Accept-Language": $config.locale,
    },
    method: "POST",
    complete: function (result) {
      if (result.status == 200) {
        resetLoginForm();
        new Notify({
          title: $i18n.success_expression,
          text: result.responseJSON.message,
          status: "success",
          autotimeout: 2000,
        });
        setCookie("moneezy_token", result.responseJSON.token);
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
      }
    },
  });
}

function resetLoginForm() {
  $("#form-login\\[email\\]").val("");
  $("#form-login\\[password\\]").val("");
}

function isValidLogin() {
  var valid = true;

  if ($("#form-login\\[email\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.email_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if ($("#form-login\\[password\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.password_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  return valid;
}
