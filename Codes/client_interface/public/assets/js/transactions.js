$(document).ready(function () {
  $(document).on("click", ".btn-change-date", function () {
    var type = $(this).attr("data-type");
    dealChangeDate(type);
  });

  $(document).on("click", ".item-edit-transaction", function () {
    var month = $(this).attr("data-month");
    var date = $(this).attr("data-date");
    var id = $(this).attr("data-id");
    dealEditTransaction(month, date, id);
  });

  $(document).on("click", "#btn-remove-transaction", function () {
    dealRemoveTransaction();
  });

  $("#input-search").on("input", function () {
    var searchText = removeAccents($(this).val().toLowerCase());
    dealSearchTransaction(searchText);
  });

  initializeDatepicker();
});

function dealSearchTransaction(searchText) {
  $(".item-edit-transaction").each(function () {
    var categoryName = removeAccents(
      $(this).find(".category-name").text().toLowerCase()
    );
    if (categoryName.includes(searchText) || searchText === "") {
      $(this).removeClass("d-none");
    } else {
      $(this).addClass("d-none");
    }
  });

  $(".transaction-list").removeClass("d-none");
  $(".transaction-list").each(function () {
    var hasVisibleItems = $(this).find(".item-edit-transaction:visible").length > 0;
    if (hasVisibleItems) {
      $(this).removeClass("d-none");
    } else {
      $(this).addClass("d-none");
    }
  });
}

function dealRemoveTransaction() {
  Swal.fire({
    icon: "warning",
    confirmButtonColor: "#db9357",
    text: $i18n.swal_remove_transaction_text,
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonText: $i18n.remove_button,
    cancelButtonText: $i18n.cancel_text,
  }).then((result) => {
    if (result.isConfirmed) {
      removeTransaction();
    }
  });
}

function removeTransaction() {
  const date = $("#form-transactions\\[date\\]").val();
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/transaction/delete/${date}/${$editTransactionId}`,
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "DELETE",
    complete: function (result) {
      if (result.status == 200) {
        $("#modal-transactions").modal("hide");
        setTransactionList(
          result.responseJSON.transaction_list,
          result.responseJSON.balance
        );
        showTransaction($("#filter-transaction-date").val());
      }
    },
  });
}

function dealEditTransaction(month, date, id) {
  var splitDate = month.split("-");
  month = `${splitDate[0]}-${splitDate[1]}`;

  var elem = null;
  for (var i in $transaction_list[month][date]) {
    if ($transaction_list[month][date][i].transaction_id == id) {
      elem = $transaction_list[month][date][i];
    }
  }

  if (elem != null) {
    resetTransactionForm();
    $("#btn-remove-transaction").removeClass("d-none");
    $editTransactionId = elem.transaction_id;
    var splitDate = elem.date.split("-");

    $("#form-transactions\\[type\\]").val(elem.type).change();
    $("#form-transactions\\[description\\]").val(elem.name);
    $("#form-transactions\\[value_string\\]").val(formatCurrency(elem.value));
    $("#form-transactions\\[value\\]").val(elem.value);
    $("#form-transactions\\[date\\]").val(elem.date);
    $("#form-transactions\\[date_string\\]").val(
      `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    );
    $("#form-transactions\\[status\\]").val(elem.status ? 1 : 0);
    $("#form-transactions\\[category\\]").val(elem.category_id);
    $("#modal-transactions").modal("show");
  } else {
    new Notify({
      title: $i18n.transaction_not_found,
      text: $i18n.refresh_page,
      status: "error",
    });
  }
}

function showTransaction(date) {
  var splitDate = date.split("-");
  date = `${splitDate[0]}-${splitDate[1]}`;

  const list = $transaction_list[date];

  var keys = [];
  if (list) {
    keys = Object.keys(list);
  }

  var html = ``;
  if (keys.length > 0) {
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i];
      const dateSplit = key.split("-");
      html += `<div class="p-4 ${i > 0 ? "border-bottom" : ""} transaction-list">`;
      html += ` <div class="d-flex mb-3">`;
      html += `   <div class="text-bold" style="width: 50px;">${dateSplit[2]}</div>`;
      html += `   <div class="text-muted">${getDayOfWeek(key)}</div>`;
      html += ` </div>`;
      for (var j in list[key]) {
        const elem = list[key][j];
        const category = getCategotyInfo(elem.type, elem.category_id);

        var colorStatus = "#fff";
        if (!elem.status) {
          var date1 = new Date(key + "T00:00:00");
          date1.setHours(12);
          date1.setMinutes(0);
          date1.setSeconds(0);
          date1.setMilliseconds(0);

          var date2 = new Date();
          date2.setHours(12);
          date2.setMinutes(0);
          date2.setSeconds(0);
          date2.setMilliseconds(0);

          if (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
          ) {
            colorStatus = "#F9F2DA";
          } else if (date1 < date2) {
            colorStatus = "#f9dada";
          }
        }

        html += `<div class="d-flex aligm-itens-center-justify-content-between item-edit-transaction p-2 rounded ${
          j == list[key].length - 1 ? "" : "mb-3"
        }" style="background: ${colorStatus} " data-month="${date}" data-date=${key} data-id="${
          elem.transaction_id
        }">`;
        html += `   <div class="category me-2" style="flex: 1;">`;
        html += `     <div class="category-icon" title="${category.name}" style="background:${category.color}50;color:${category.color}"><span class="sap-icons">&#${category.icon};</span></div>`;
        html += `     <div class="category-name">${elem.name}</div>`;
        html += `   </div>`;
        html += `   <div class="w-25 d-flex align-items-center justify-content-end">`;
        html += `     <div class="text-bold ${
          elem.type == "I" ? "text-success" : "text-danger"
        }">${formatCurrency(elem.value)}</div>`;
        html += `     <span class="sap-icons ms-1" style="opacity:${
          elem.status ? "1" : ".5"
        }" data-new-status="${elem.status ? "0" : "1"}">`;
        if (elem.status) {
          html += `&#xe222;`;
        } else {
          html += `&#xe223;`;
        }
        html += `</span>`;

        html += `   </div>`;
        html += `</div>`;
      }
      html += `</div>`;
    }
  } else {
    html += `<div class="alert alert-secondary">`;
    html += ` <div class="alert-content">`;
    html += `   <div class="alert-title">${$i18n.error_expression}</div>`;
    html += `   <div class="alert-text">${$i18n.no_results}</div>`;
    html += ` </div>`;
    html += `</div>`;
  }

  $("#div-transaction-result").html(html);
}

function dealChangeDate(type) {
  var [year, month, day] = $("#filter-transaction-date")
    .val()
    .split("-")
    .map(Number);

  if (type == "previous") {
    if (month == 1) {
      month = 12;
      year -= 1;
    } else {
      month -= 1;
    }
  } else {
    if (month == 12) {
      month = 1;
      year += 1;
    } else {
      month += 1;
    }
  }

  const date = new Date(year, month - 1, day);
  $("#transaction-date").datepicker("setDate", date);
}

function dealLoadTransaction(date) {
  var splitDate = date.split("-");
  date = `${splitDate[0]}-${splitDate[1]}`;

  if ($transaction_list) {
    if (typeof $transaction_list == "string") {
      $transaction_list = JSON.parse($transaction_list);
    }

    if ($transaction_list[date] == undefined) {
      loadTransaction(date, function () {
        showTransaction(date);
      });
    } else {
      showTransaction(date);
    }
  } else {
    loadTransaction(date, function () {
      showTransaction(date);
    });
  }
}

function initializeDatepicker() {
  $("#transaction-date").datepicker({
    autoPick: true,
    format: "YYYY/MM",
    autoHide: true,
    language: $config.i18n_language,
    pick: function (e) {
      e.preventDefault();

      const month = String(e.date.getMonth() + 1).padStart(2, "0");
      const monthName = new Intl.DateTimeFormat($config.i18n_language, {
        month: "long",
      }).format(e.date);
      const year = e.date.getFullYear();

      $("#transaction-date").html(
        `${capitalizeFirstLetter(monthName)}${$i18n.string_divider}${year}`
      );

      const date = `${year}-${month}-01`;
      $("#filter-transaction-date").val(date);
      dealLoadTransaction(date);
    },
  });
}
