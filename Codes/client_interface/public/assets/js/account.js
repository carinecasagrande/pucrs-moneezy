$(document).ready(function () {
  $("#btn-remove-account").click(function () {
    dealRemoveAccount();
  });

  $("#btn-save-update").click(function () {
    dealSaveUpdate();
  });
});

function dealSaveUpdate() {
  if (isValidUpdate()) {
    saveUpdate();
  }
}

function isValidUpdate() {
  var valid = true;

  if ($("#form-update\\[username\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.username_field,
      text: $i18n_default.field_required,
      status: "error",
    });
  }

  if ($("#form-update\\[email\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.email_field,
      text: $i18n_default.field_required,
      status: "error",
    });
  }

  const current_password = $("#form-update\\[current_password\\]").val().trim();
  const new_password = $("#form-update\\[new_password\\]").val().trim();

  if (current_password != "" || new_password != "") {
    if (current_password == "") {
      valid = false;
      new Notify({
        title: $i18n.current_password_field,
        text: $i18n_default.field_required,
        status: "error",
      });
    }

    if (new_password == "") {
      valid = false;
      new Notify({
        title: $i18n.new_password_field,
        text: $i18n_default.field_required,
        status: "error",
      });
    }
  }

  return valid;
}

function saveUpdate() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/user/update`,
    data: $("#form-update").serialize(),
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "PUT",
    complete: function (result) {
      if (result.status == 200) {
        new Notify({
          title: $i18n_default.success_expression,
          text: result.responseJSON.message,
          status: "success",
          autotimeout: 2000,
        });
        setCookie("moneezy_token", result.responseJSON.token);
        setTimeout(function () {
          window.location.href = "/account";
        }, 2000);
      }
    },
  });
}

function dealRemoveAccount() {
  Swal.fire({
    icon: "warning",
    confirmButtonColor: "#db9357",
    input: "text",
    html: $i18n.swal_delete_account_text,
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonText: $i18n.swal_delete_account_button,
    cancelButtonText: $i18n_default.cancel_text,
    inputValidator: (value) => {
      if (!value) {
        return $i18n.swal_delete_account_confirm_required;
      } else if (value.toLowerCase() !== $i18n.delete_account_button.toLowerCase()) {
        return $i18n.swal_delete_account_confirm_incorrect;
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      removeAccount();
    }
  });
}

function removeAccount() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/user/delete`,
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "DELETE",
    complete: function (result) {
      if (result.status == 200) {
        setCookie("moneezy_token", "");
        window.location.href = "/";
      }
    },
  });
}
