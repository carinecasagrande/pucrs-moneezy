$(document).ready(function () {
  $("#btn-reset-password").click(function () {
    dealResetPassword();
  });
});

function dealResetPassword() {
  if (isValidResetPassword()) {
    changePassword();
  }
}

function resetResetPasswordForm() {
  $("#form-reset-password\\[password\\]").val("");
  $("#form-reset-password\\[password_confirmation\\]").val("");
}

function changePassword() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/user/changePassword`,
    data: $("#form-reset-password").serialize(),
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${$token}`,
    },
    method: "PATCH",
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    complete: function (result) {
      $.LoadingOverlay("hide");
      if (result.status == 200) {
        resetResetPasswordForm();
        new Notify({
          title: $config.success_expression,
          text: result.responseJSON.message,
          status: "success",
        });
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

function isValidResetPassword() {
  var valid = true;
  const password = $("#form-reset-password\\[password\\]").val().trim();
  const password_confirmation = $("#form-reset-password\\[password_confirmation\\]")
    .val()
    .trim();

  if (password == "") {
    valid = false;
    new Notify({
      title: $i18n.password_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if (password_confirmation == "") {
    valid = false;
    new Notify({
      title: $i18n.password_confirmation_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if (password !== "" && password_confirmation !== "") {
    if (password !== password_confirmation) {
      valid = false;
      new Notify({
        title: `${$i18n.password_field} | ${$i18n.password_confirmation_field}`,
        text: $i18n.password_confirmation_diff,
        status: "error",
      });
    }
  }

  return valid;
}
