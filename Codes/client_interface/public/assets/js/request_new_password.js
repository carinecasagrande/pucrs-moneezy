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
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    complete: function (result) {
      $.LoadingOverlay("hide");
      if (result.status == 200) {
        $("#form-forgot-password\\[email\\]").val("");
        new Notify({
          title: $config.success_expression,
          text: result.responseJSON.message,
          status: "success",
          speed: 200,
        });
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
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

function isValidForgotPassword() {
  var valid = true;

  if ($("#form-forgot-password\\[email\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.email_field,
      text: $i18n.field_required,
      status: "error",
    });
  }
  return valid;
}
