$(document).ready(function () {
  $(document).on("click", ".btn-change-date", function () {
    var type = $(this).attr("data-type");
    dealChangeDate(type);
  });

  $(document).on("click", ".btn-edit-budget", function () {
    dealEditValue($(this), "edit");
  });

  $(document).on("click", ".btn-create-budget", function () {
    dealEditValue($(this), "create");
  });

  $(document).on("click", "#btn-save-budget", function () {
    dealSaveValue();
  });

  $(document).on("click", "#btn-remove-budget", function () {
    dealRemoveBudget();
  });

  $(document).on("change", "#form-save-budget\\[value_string\\]", function () {
    var value = $(this).val();
    $("#form-save-budget\\[value\\]").val(parseCurrency(value));
  });

  initializeDatepicker();
});

function dealRemoveBudget() {
  Swal.fire({
    icon: "warning",
    confirmButtonColor: "#db9357",
    text: $i18n.swal_remove_budget_text,
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonText: $i18n.remove_button,
    cancelButtonText: $i18n.cancel_text,
  }).then((result) => {
    if (result.isConfirmed) {
      removeBudget();
    }
  });
}

function removeBudget() {
  const date = $("#form-save-budget\\[date\\]").val();
  const category = $("#form-save-budget\\[category_id\\]").val();
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/budget/delete/${date}/${category}`,
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "DELETE",
    complete: function (result) {
      if (result.status == 200) {
        $("#modal-save-budget").modal("hide");
        setBudgetList(date, result.responseJSON.budget_list);
        dealShowBudget(date);
      }
    },
  });
}

function dealEditValue(elem, type) {
  $("#modal-save-budget-title").text(elem.attr("data-name"));
  $("#modal-save-budget-subtitle").text($("#budget-date").text());
  $("#form-save-budget\\[date\\]").val(elem.attr("data-date"));
  $("#form-save-budget\\[category_id\\]").val(elem.attr("data-category"));
  $("#form-save-budget\\[value\\]").val(elem.attr("data-value"));
  $("#form-save-budget\\[value_string\\]").val(
    elem.attr("data-value") == "" ? "" : formatFloat(elem.attr("data-value"))
  );

  if (type == "edit") {
    $("#btn-remove-budget").removeClass("d-none");
  } else {
    $("#btn-remove-budget").addClass("d-none");
  }

  $("#modal-save-budget").modal("show");
}

function dealSaveValue() {
  if (isValidBudget()) {
    saveBudget();
  }
}

function isValidBudget() {
  var valid = true;

  if ($("#form-save-budget\\[value_string\\]").val() == "") {
    valid = false;
    new Notify({
      title: $i18n.budget_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  return valid;
}

function saveBudget() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/budget/save`,
    data: $("#form-save-budget").serialize(),
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "POST",
    complete: function (result) {
      if (result.status == 200) {
        $("#modal-save-budget").modal("hide");
        const date = $("#form-save-budget\\[date\\]").val();
        setBudgetList(date, result.responseJSON.budget_list);
        dealShowBudget(date);
      }
    },
  });
}

function dealChangeDate(type) {
  var [year, month, day] = $("#filter-budget-date").val().split("-").map(Number);

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
  $("#budget-date").datepicker("setDate", date);
}

function dealLoadBudget(date) {
  if ($budget_list) {
    if (typeof $budget_list == "string") {
      $budget_list = JSON.parse($budget_list);
    }

    if ($budget_list[date] == undefined) {
      loadBudget(date);
      dealShowBudget(date);
    } else {
      dealShowBudget(date);
    }
  } else {
    loadBudget(date);
    dealShowBudget(date);
  }
}

function showBudget(date) {
  var expenseByCategory = getValueExpenseByCategoryAndMonth(date);
  var html = ``;
  const expensesCategory = $category_list["O"];
  const bugdetMonth = $budget_list[date];

  if (expensesCategory.length > 0) {
    for (var i in expensesCategory) {
      const category = expensesCategory[i];
      const valueBudget = bugdetMonth[category.category_id];

      html += `<div class="mb-4">`;
      html += ` <div class="d-flex align-items-center justify-content-between">`;
      html += `   <p class="mb-1 me-2">${category.name}</p>`;
      html += `   <div>`;
      var percent1 = 0;
      var percent2 = 0;
      if (valueBudget) {
        var percentTotal = 0;
        var percentRealized = 0;
        var valueTotal = 0;
        if (expenseByCategory[category.category_id]) {
          valueTotal = expenseByCategory[category.category_id].total;
          percentTotal = calcPercent(
            valueBudget,
            expenseByCategory[category.category_id].total
          );
          percentRealized = calcPercent(
            valueBudget,
            expenseByCategory[category.category_id].realized
          );
        }

        if (percentRealized > percentTotal) {
          percent1 = percentRealized;
        } else {
          percent1 = percentRealized;
          percent2 = percentTotal - percent1;
        }

        if (valueTotal > 0) {
          html += `   <span class="text-bold">${formatCurrency(valueTotal)}</span> ${
            $i18n.string_divider
          } `;
        }

        html += `   ${formatCurrency(valueBudget)}`;
        html += `   <button class="btn btn-sm btn-edit-budget" data-name="${category.name}" tabindex="0" data-bs-placement="bottom" data-date="${date}" data-category=${category.category_id} data-value=${valueBudget} data-bs-toggle="popover"><span class="sap-icons">&#xe038;</span></button>`;
      } else {
        html += `   <button class="btn btn-sm btn-create-budget" data-name="${category.name}" tabindex="0" data-bs-placement="bottom" data-date="${date}" data-category=${category.category_id} data-value="" data-bs-toggle="popover"><span class="sap-icons">&#xe058;</span></button>`;
      }
      html += `   </div>`;
      html += ` </div>`;
      html += ` <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">`;
      html += `   <div class="progress-bar" style="background-color: ${category.color}; width: ${percent1}%"></div>`;
      html += `   <div class="progress-bar" style="background-color: ${category.color};width: ${percent2}%;opacity: 0.3"></div>`;
      html += ` </div>`;
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

  $("#div-budget-result").html(html);
}

function dealShowBudget(date) {
  var splitDate = date.split("-");
  if (
    $transaction_list == null ||
    $transaction_list[`${splitDate[0]}-${splitDate[1]}`] == undefined
  ) {
    loadTransaction(date, function () {
      showBudget(date);
    });
  } else {
    showBudget(date);
  }
}

function initializeDatepicker() {
  $("#budget-date").datepicker({
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

      $("#budget-date").html(
        `${capitalizeFirstLetter(monthName)}${$i18n.string_divider}${year}`
      );

      const date = `${year}-${month}-01`;
      $("#filter-budget-date").val(date);
      dealLoadBudget(date);
    },
  });
}
