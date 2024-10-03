var $transactions_list = getCookie("moneezy_transactions");

$(document).ready(function () {
  $(document).on("click", ".btn-change-date", function () {
    var type = $(this).attr("data-type");
    dealChangeDate(type);
  });

  initializeDatepicker();
});

function dealChangeDate(type) {
  var [year, month, day] = $("#filter-transactions-date")
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
  $("#transactions-date").datepicker("setDate", date);
}

function dealLoadTransactions(date) {
  if ($transactions_list) {
    if (typeof $transactions_list == "string") {
      $transactions_list = JSON.parse($transactions_list);
    }

    if ($transactions_list[date] == undefined) {
      loadTransactions(date);
    } else {
      showBudget(date);
    }
  } else {
    loadTransactions(date);
  }
}

function setTransactionsList(date, list) {
  if (!$budget_list) {
    $budget_list = {};
  }

  $budget_list[date] = list;
  setCookie("moneezy_budget", JSON.stringify($budget_list));
}

function loadTransactions(date) {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/transactions/list/${date}`,
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "GET",
    complete: function (result) {
      if (result.status == 200) {
        setTransactionsList(date, result.responseJSON.transaction_list);
        showBudget(date);
      }
    },
  });
}

function initializeDatepicker() {
  $("#transactions-date").datepicker({
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

      $("#transactions-date").html(
        `${capitalizeFirstLetter(monthName)}${$i18n.string_divider}${year}`
      );

      $("#filter-transactions-date").val(`${year}-${month}-01`);
      dealLoadTransactions(`${year}-${month}`);
    },
  });
}
