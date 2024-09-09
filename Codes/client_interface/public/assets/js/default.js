$(document).ready(function () {
  $(".btn-see-password").click(function () {
    dealSeePassword($(this));
  });

  $("#btn-logout").click(function () {
    dealLogout();
  });

  $("form").on("submit", function (event) {
    event.preventDefault();
  });

  $(document).ajaxSend(function (event, jqxhr, settings) {
    dealConfigureAjaxBeforeSend();
  });

  $(document).ajaxComplete(function (event, jqxhr, settings) {
    dealConfigureAjaxAfterComplete(jqxhr);
  });

  initializeLoadingOverlay();
});

function dealConfigureAjaxBeforeSend() {
  $.LoadingOverlay("show");
}

function dealConfigureAjaxAfterComplete(jqxhr) {
  $.LoadingOverlay("hide");

  if (jqxhr.status == 401) {
    setCookie("moneezy_token", "");
    window.location.href = "/";
  } else if (jqxhr.status != 200) {
    new Notify({
      title: $config.error_expression,
      text: jqxhr.responseJSON.message,
      status: "error",
    });
  }
}

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
    complete: function (result) {
      if (result.status == 200) {
        setCookie("moneezy_token", "");
        window.location.href = "/";
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
    elem.html("");
  } else {
    field.attr("type", "password");
    elem.html("");
  }
}
