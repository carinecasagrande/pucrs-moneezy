$(document).ready(function () {
  $(".btn-see-password").click(function () {
    dealSeePassword($(this));
  });

  $("#btn-logout").click(function () {
    dealLogout();
  });

  initializeLoadingOverlay();
});

function dealLogout() {
  Swal.fire({
    icon: "warning",
    confirmButtonColor: "#db9357",
    text: $i18n_default.swal_logout_text,
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonText: $i18n_default.swal_logout_button,
    cancelButtonText: $i18n_default.swal_cancel_button,
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
    }
  });
}

function getCookie(key) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${key}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function setCookie(key, value) {
  document.cookie = `${key}=${value}`;
}

function logout() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/user/logout`,
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "POST",
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    complete: function (result) {
      $.LoadingOverlay("hide");
      if (result.status == 200) {
        setCookie("moneezy_token", "");
        window.location.href = "/";
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

function initializeLoadingOverlay() {
  $.LoadingOverlaySetup({
    imageColor: "#f46664",
  });
}

function dealSeePassword(elem) {
  const field = $(`${elem.attr("data-id")}`);
  if (field.attr("type") == "password") {
    field.attr("type", "text");
    elem.html("&#xe1ea;");
  } else {
    field.attr("type", "password");
    elem.html("&#xe1e9;");
  }
}
