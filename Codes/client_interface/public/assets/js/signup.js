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
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    complete: function (result) {
      $.LoadingOverlay("hide");
      if (result.status == 201) {
        resetSignupForm();
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
      text: $i18n.field_required,
      status: "error",
    });
  }

  if ($("#form-signup\\[email\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.email_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if ($("#form-signup\\[password\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.password_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  return valid;
}
