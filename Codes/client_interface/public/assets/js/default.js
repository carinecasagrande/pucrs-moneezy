var $category_list = JSON.parse(getCookie("moneezy_categories"));
var $balance = getCookie("moneezy_balance");

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
    dealConfigureAjaxAfterComplete(jqxhr, settings);
  });

  initializeLoadingOverlay();
  initializeMasks();
});

function initializeMasks() {
  if ($config.i18n_language == "pt-BR") {
    $(".mask-money").mask("#.##0,00", { reverse: true });
    $(".mask-date").mask("00/00/0000");
  } else {
    $(".mask-money").mask("#,##0.00", { reverse: true });
    $(".mask-date").mask("0000-00-00");
  }
}

function dealConfigureAjaxBeforeSend() {
  $.LoadingOverlay("show");
}

function dealConfigureAjaxAfterComplete(jqxhr, settings) {
  $.LoadingOverlay("hide");

  if (jqxhr.status == 401) {
    clearCookies();
    window.location.href = "/";
  } else if (jqxhr.status != 200) {
    if (settings.skipAjaxComplete) {
      return;
    }

    new Notify({
      title: $i18n.error_expression,
      text: jqxhr.responseJSON.message,
      status: "error",
    });
  }
}

function dealLogout() {
  Swal.fire({
    icon: "warning",
    confirmButtonColor: "#db9357",
    text: $i18n.swal_logout_text,
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonText: $i18n.swal_logout_button,
    cancelButtonText: $i18n.cancel_text,
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
    }
  });
}

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getCookie(key) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${key}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
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
        clearCookies();
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
    elem.html("&#xe1ea;");
  } else {
    field.attr("type", "password");
    elem.html("&#xe1e9;");
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function clearCookies() {
  setCookie("moneezy_token", "");
  setCookie("moneezy_categories", "");
  setCookie("moneezy_budget", "");
  setCookie("moneezy_transaction", "");
  setCookie("moneezy_balance", "");
}

function formatCurrency(value) {
  if (typeof value !== "number") {
    value = parseFloat(value);
  }

  return value.toLocaleString($config.i18n_language, {
    style: "currency",
    currency: $config.currency,
  });
}

function formatFloat(value) {
  if (typeof value !== "number") {
    value = parseFloat(value);
  }

  return value.toLocaleString($config.i18n_language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrency(value) {
  if (typeof value !== "number") {
    value = value.replace(/(R\$|\$|\s)/g, "");
    if ($config.i18n_language == "pt-BR") {
      value = value.replace(/\./g, "");
      value = value.replace(/,/g, ".");
    } else {
      value = value.replace(/,/g, "");
    }
    value = parseFloat(value);
  }

  return Math.round(value * 100) / 100;
}

function parseDate(date) {
  if ($config.i18n_language == "pt-BR") {
    var dateArr = date.split("/");
    date = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
  }

  return date;
}

function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  const dayOfWeek = new Intl.DateTimeFormat($config.i18n_language, {
    weekday: "long",
  }).format(date);
  return dayOfWeek;
}

function getCategotyInfo(type, id) {
  for (var i in $category_list[type]) {
    if ($category_list[type][i].category_id == id) {
      return {
        icon: $category_list[type][i].icon,
        color: $category_list[type][i].color,
        name: $category_list[type][i].name,
      };
    }
  }

  return {
    icon: "xe1af",
    color: "#4E4E4E",
    name: $i18n.others,
  };
}
