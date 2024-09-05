$(document).ready(function () {
  $("#btn-login").click(function () {
    dealLogin();
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
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    complete: function (result) {
      $.LoadingOverlay("hide");
      if (result.status == 200) {
        resetLoginForm();
        new Notify({
          title: $config.success_expression,
          text: result.responseJSON.message,
          status: "success",
        });
        setCookie("moneezy_token", result.responseJSON.token);
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      } else {
        new Notify({
          title: $config.error_expression,
          text: result.responseJSON.message,
          status: "error",
        });
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
