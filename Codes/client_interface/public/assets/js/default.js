var $category_list = getCookie("moneezy_categories");
if ($category_list) {
  $category_list = JSON.parse($category_list);
}
var $balance = getCookie("moneezy_balance");

var $budget_list = getCookie("moneezy_budget");
if ($budget_list) {
  $budget_list = JSON.parse($budget_list);
}

var $transaction_list = getCookie("moneezy_transaction");
if ($transaction_list) {
  $transaction_list = JSON.parse($transaction_list);
}

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

  $(document).on("click", "#btn-save-transaction", function () {
    dealSaveTransaction();
  });

  $(document).on("change", "#form-transactions\\[value_string\\]", function () {
    var value = $(this).val();
    $("#form-transactions\\[value\\]").val(parseCurrency(value));
  });

  $(document).on("change", "#form-transactions\\[date_string\\]", function () {
    var date = $(this).val();
    $("#form-transactions\\[date\\]").val(parseDate(date));
  });

  $(document).on("change", "#form-transactions\\[type\\]", function () {
    var type = $(this).val();
    dealChangeType(type);
  });

  $(document).on("click", ".btn-add-transaction", function () {
    resetTransactionForm();
    $("#form-transactions\\[type\\]").val($(this).attr("data-type")).change();
    $("#modal-transactions").modal("show");
  });

  initializeLoadingOverlay();
  initializeMasks();
});

function isValidTransaction() {
  var valid = true;

  if (["I", "O"].indexOf($("#form-transactions\\[type\\]").val()) == -1) {
    valid = false;
    new Notify({
      title: $i18n.type,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if ($("#form-transactions\\[description\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.description,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if ($("#form-transactions\\[value_string\\]").val() == "") {
    valid = false;
    new Notify({
      title: $i18n.value,
      text: $i18n.field_required,
      status: "error",
    });
  } else {
    var value = parseCurrency($("#form-transactions\\[value_string\\]").val());
    if (value <= 0) {
      valid = false;
      new Notify({
        title: $i18n.value,
        text: $i18n.field_required,
        status: "error",
      });
    }
  }

  if ($("#form-transactions\\[date\\]").val() == "") {
    valid = false;
    new Notify({
      title: $i18n.date,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if (["0", "1"].indexOf($("#form-transactions\\[status\\]").val()) == -1) {
    valid = false;
    new Notify({
      title: $("#form-transactions-status-label").text(),
      text: $i18n.field_required,
      status: "error",
    });
  }

  return valid;
}

var $editTransactionId = null;
function saveTransaction() {
  var url = `${$config.endpoind_api_gateway}/api/transaction/create`;
  var method = "POST";
  if ($editTransactionId != null) {
    url = `${$config.endpoind_api_gateway}/api/transaction/update/${$editTransactionId}`;
    method = "PUT";
  }

  $.ajax({
    url,
    data: $("#form-transactions").serialize(),
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method,
    complete: function (result) {
      if (result.status == 200) {
        $("#modal-transactions").modal("hide");
        setTransactionList(
          result.responseJSON.transaction_list,
          result.responseJSON.balance
        );

        if (typeof showTransaction == "function") {
          showTransaction($("#filter-transaction-date").val());
        }

        if (typeof loadDashboardResume == "function") {
          loadDashboardResume();
        }
      }
    },
  });
}

function dealChangeType(type) {
  var status = type == "I" ? $i18n.revenue_status : $i18n.expense_status;
  $("#form-transactions-status-label").text(`${status}?`);

  var html = `<option value=""></option>`;
  for (var i in $category_list[type]) {
    html += `<option value="${$category_list[type][i].category_id}">${$category_list[type][i].name}</option>`;
  }
  $("#form-transactions\\[category\\]").html(html);
}

function resetTransactionForm() {
  $("#form-transactions\\[description\\]").val("");
  $("#form-transactions\\[value_string\\]").val("");
  $("#form-transactions\\[value\\]").val("");
  $("#form-transactions\\[date_string\\]").val("");
  $("#form-transactions\\[date\\]").val("");
  $("#form-transactions\\[status\\]").val("0");
  $("#btn-remove-transaction").addClass("d-none");
  $editTransactionId = null;
}

function dealSaveTransaction() {
  if (isValidTransaction()) {
    saveTransaction();
  }
}

function getValueExpenseByCategoryAndMonth(date) {
  var splitDate = date.split("-");
  date = `${splitDate[0]}-${splitDate[1]}`;
  const list = $transaction_list[date];

  var result = {};
  for (var i in list) {
    for (var j in list[i]) {
      const elem = list[i][j];

      if (elem.type == "O") {
        var category = elem.category_id == null ? 0 : elem.category_id;
        if (result[category] == undefined) {
          result[category] = {
            total: 0,
            realized: 0,
          };
        }
        result[category].total += elem.value;

        if (elem.status) {
          result[category].realized += elem.value;
        }
      }
    }
  }

  return result;
}

function calcPercent(valueBase, value) {
  return (value * 100) / valueBase;
}

function loadTransaction(date, callback) {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/transaction/list/${date}`,
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "GET",
    complete: function (result) {
      if (result.status == 200) {
        setTransactionList(
          result.responseJSON.transaction_list,
          result.responseJSON.balance
        );

        callback();
      }
    },
  });
}

function setTransactionList(list, balance) {
  if (!$transaction_list) {
    $transaction_list = {};
    $balance = 0;
  }

  $balance = balance;
  for (var i in list) {
    $transaction_list[i] = list[i];
  }

  setCookie("moneezy_transaction", JSON.stringify($transaction_list));
  setCookie("moneezy_balance", JSON.stringify($balance));
}

function loadBudget(date, callback) {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/budget/list/${date}`,
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "GET",
    complete: function (result) {
      if (result.status == 200) {
        setBudgetList(date, result.responseJSON.budget_list);
        callback();
      }
    },
  });
}

function setBudgetList(date, list) {
  if (!$budget_list) {
    $budget_list = {};
  }

  $budget_list[date] = list;
  setCookie("moneezy_budget", JSON.stringify($budget_list));
}

function initializeMasks() {
  if ($config.i18n_language == "pt-BR") {
    $(".mask-money").mask("#.##0,00", { reverse: true });
    $(".mask-date").mask("00/00/0000");
  } else {
    $(".mask-money").mask("#,##0.00", { reverse: true });
    $(".mask-date").mask("0000-00-00");
  }

  $(".mask-date").datepicker({
    autoPick: true,
    autoHide: true,
    language: $config.i18n_language,
  });
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
