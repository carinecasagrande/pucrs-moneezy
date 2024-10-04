$(document).ready(function () {
  $(document).on("click", ".btn-change-date", function () {
    var type = $(this).attr("data-type");
    dealChangeDate(type);
  });

  initializeDatepicker();
});

function dealChangeDate(type) {
  var [year, month, day] = $("#filter-report-date").val().split("-").map(Number);

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
  $("#report-date").datepicker("setDate", date);
}

function dealLoadReport(date) {
  loadBudget(date, function () {
    loadTransaction(date, function () {
      showReport(date);
    });
  });
}

var chartExpensesRevenues = null;
function buildChartExpensesRevenues(transactionDate) {
  var realizedExpenses = 0;
  var pendingExpenses = 0;
  var realizedRevenues = 0;
  var pendingRevenues = 0;
  for (var i in $transaction_list[transactionDate]) {
    for (var j in $transaction_list[transactionDate][i]) {
      const elem = $transaction_list[transactionDate][i][j];
      if (elem.type == "I") {
        if (elem.status) {
          realizedRevenues += elem.value;
        } else {
          pendingRevenues += elem.value;
        }
      } else {
        if (elem.status) {
          realizedExpenses += elem.value;
        } else {
          pendingExpenses += elem.value;
        }
      }
    }
  }

  if (chartExpensesRevenues != null) {
    chartExpensesRevenues.destroy();
  }
  chartExpensesRevenues = new Chart("chart-expenses-revenues", {
    type: "bar",
    data: {
      labels: [$i18n.expenses, $i18n.revenues],
      datasets: [
        {
          label: $i18n.realized,
          data: [realizedExpenses, realizedRevenues],
          backgroundColor: ["rgba(244, 102, 100, 0.6)", "rgba(0, 135, 115, 0.6)"],
          borderColor: "#fff",
          borderWidth: 1,
          barThickness: 30,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
        },
        {
          label: $i18n.pending,
          data: [pendingExpenses, pendingRevenues],
          backgroundColor: ["rgba(244, 102, 100, 0.3)", "rgba(0, 135, 115, 0.3)"],
          borderColor: "#fff",
          borderWidth: 1,
          barThickness: 30,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
        },
      ],
    },
    options: {
      hover: {
        mode: null,
      },
      plugins: {
        title: {
          display: true,
          text: `${$i18n.expenses} x ${$i18n.revenues}`,
          font: {
            size: 16,
            family: "Poppins",
            weight: "normal",
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";

              if (label) {
                label += ": ";
              }

              label += formatCurrency(context.raw);

              return label;
            },
          },
        },
      },
      responsive: true,
      maintainaspectratio: false,
      indexAxis: "y",
      scales: {
        x: {
          stacked: true,

          ticks: {
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

var chartExpensesCategory = null;
function buildChartExpensesCategory(costByCategoryObj) {
  var data = [];
  var label = [];
  var color = [];
  var border = [];
  for (var i in costByCategoryObj) {
    var category = getCategotyInfo("O", i);
    data.push(costByCategoryObj[i].total);
    label.push(category.name);
    color.push(category.color + "c7");
    border.push(category.color);
  }

  if (chartExpensesCategory != null) {
    chartExpensesCategory.destroy();
  }
  chartExpensesCategory = new Chart("chart-expenses-category", {
    type: "pie",
    data: {
      labels: label,
      datasets: [
        {
          label: "",
          data: data,
          backgroundColor: color,
        },
      ],
    },
    options: {
      hover: {
        mode: null,
      },
      plugins: {
        title: {
          display: true,
          text: `${$i18n.expenses} x ${$i18n.revenues}`,
          font: {
            size: 16,
            family: "Poppins",
            weight: "normal",
          },
        },
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              label += formatCurrency(context.raw);
              return label;
            },
          },
        },
      },
      responsive: true,
      maintainaspectratio: false,
    },
  });
}

var chartExpensesBudget = null;
function buildChartExpensesBudget(costByCategoryObj, date) {
  var budgetByCategory = $budget_list[date];
  console.log(costByCategoryObj);

  var labels = [];
  var budgetData = [];
  var budgetColor = [];
  var realizedData = [];
  var realizedColor = [];
  var pendingData = [];
  var pendingColor = [];
  for (var i in budgetByCategory) {
    var category = getCategotyInfo("O", i);
    labels.push(category.name);
    budgetData.push(budgetByCategory[i]);
    budgetColor.push(category.color + "de");
    realizedColor.push(category.color + "b3");
    pendingColor.push(category.color + "70");

    if (costByCategoryObj[i]) {
      realizedData.push(costByCategoryObj[i].realized);
      pendingData.push(costByCategoryObj[i].total - costByCategoryObj[i].realized);
    } else {
      realizedData.push(0);
      pendingData.push(0);
    }
  }

  console.log(labels);

  // var label = [];
  // var color = [];
  // var border = [];
  // for (var i in costByCategoryObj) {
  // var category = getCategotyInfo("O", i);
  // data.push(costByCategoryObj[i].total);
  // label.push(category.name);
  // color.push(category.color + "c7");
  // border.push(category.color);
  // }

  if (chartExpensesBudget != null) {
    chartExpensesBudget.destroy();
  }
  chartExpensesBudget = new Chart("chart-expenses-budget", {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: $i18n.realized,
          data: realizedData,
          backgroundColor: realizedColor,
          stack: "stack0",
          borderColor: "#fff",
          borderWidth: 1,
          barThickness: 30,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
        },
        {
          label: $i18n.pending,
          data: pendingData,
          backgroundColor: pendingColor,
          stack: "stack0",
          borderColor: "#fff",
          borderWidth: 1,
          barThickness: 30,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
        },
        {
          label: $i18n.budgeted,
          data: budgetData,
          backgroundColor: budgetColor,
          stack: "stack1",
          borderColor: "#fff",
          borderWidth: 1,
          barThickness: 30,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
        },
      ],
    },
    options: {
      hover: {
        mode: null,
      },
      plugins: {
        title: {
          display: true,
          text: `${$i18n.budgeted} x ${$i18n.realized}`,
          font: {
            size: 16,
            family: "Poppins",
            weight: "normal",
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";

              if (label) {
                label += ": ";
              }

              label += formatCurrency(context.raw);

              return label;
            },
          },
        },
      },
      responsive: true,
      maintainaspectratio: false,
      indexAxis: "y",
      // barThickness: 30,
      scales: {
        x: {
          stacked: true,
          ticks: {
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
        y: {
          stacked: true,
          // ticks: {
          //   padding: 10, // Espaçamento entre as barras
          // },
        },
      },
    },
  });
}

function showReport(date) {
  var splitDate = date.split("-");
  var transactionDate = `${splitDate[0]}-${splitDate[1]}`;
  var costByCategoryObj = getValueExpenseByCategoryAndMonth(transactionDate);

  buildChartExpensesRevenues(transactionDate);
  buildChartExpensesCategory(costByCategoryObj);
  buildChartExpensesBudget(costByCategoryObj, date);
}

function initializeDatepicker() {
  $("#report-date").datepicker({
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

      $("#report-date").html(
        `${capitalizeFirstLetter(monthName)}${$i18n.string_divider}${year}`
      );

      const date = `${year}-${month}-01`;
      $("#filter-report-date").val(date);
      dealLoadReport(date);
    },
  });
}
