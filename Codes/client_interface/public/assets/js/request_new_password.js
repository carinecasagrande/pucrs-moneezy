$(document).ready(function () {
  $("#btn-forgot-password").click(function () {
    dealForgotPassword();
  });
});

function dealForgotPassword() {
  if (isValidForgotPassword()) {
    requestNewPassword();
  }
}

function requestNewPassword() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/user/requestNewPassword`,
    data: $("#form-forgot-password").serialize(),
    headers: {
      "Accept-Language": $config.locale,
    },
    method: "POST",
    complete: function (result) {
      if (result.status == 200) {
        $("#form-forgot-password\\[email\\]").val("");
        new Notify({
          title: $i18n_default.success_expression,
          text: result.responseJSON.message,
          status: "success",
          autotimeout: 2000,
        });
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
      }
    },
  });
}

function isValidForgotPassword() {
  var valid = true;

  if ($("#form-forgot-password\\[email\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.email_field,
      text: $i18n_default.field_required,
      status: "error",
    });
  }
  return valid;
}
