$(document).ready(function () {
  $("#btn-signup").click(function () {
    dealSignup();
  });
});

function dealSignup() {
  if (isValidSignup()) {
    signup();
  }
}

function signup() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/user/signup`,
    data: $("#form-signup").serialize(),
    headers: {
      "Accept-Language": $config.locale,
    },
    method: "POST",
    complete: function (result) {
      if (result.status == 200) {
        resetSignupForm();
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

function resetSignupForm() {
  $("#form-signup\\[username\\]").val("");
  $("#form-signup\\[email\\]").val("");
  $("#form-signup\\[password\\]").val("");
}

function isValidSignup() {
  var valid = true;

  if ($("#form-signup\\[username\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.username_field,
      text: $i18n_default.field_required,
      status: "error",
    });
  }

  if ($("#form-signup\\[email\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.email_field,
      text: $i18n_default.field_required,
      status: "error",
    });
  }

  if ($("#form-signup\\[password\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.password_field,
      text: $i18n_default.field_required,
      status: "error",
    });
  }

  return valid;
}
