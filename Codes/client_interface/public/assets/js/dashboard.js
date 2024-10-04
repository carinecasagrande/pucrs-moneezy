const today = new Date();
const year = today.getUTCFullYear();
const month = String(today.getUTCMonth() + 1).padStart(2, "0");
const formattedDate = `${year}-${month}-01`;

const splitDate = formattedDate.split("-");
const transactionDate = `${splitDate[0]}-${splitDate[1]}`;

$(document).ready(function () {
  loadDashboardResume();
  var costByCategoryObj = getValueExpenseByCategoryAndMonth(transactionDate);
  buildChartExpensesCategory(costByCategoryObj);
  buildChartExpensesBudget(costByCategoryObj);
});

var chartExpensesBudget = null;
function buildChartExpensesBudget(costByCategoryObj) {
  var budgetByCategory = $budget_list[formattedDate];
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
          display: false,
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

function loadDashboardResume() {
  const balance = getCookie("moneezy_balance");
  $("#dashboard-balance").text(formatCurrency(balance));

  var expenses = 0;
  var revenues = 0;
  var accounts_payable = [];
  var accounts_receivable = [];
  for (var i in $transaction_list[transactionDate]) {
    for (var j in $transaction_list[transactionDate][i]) {
      const elem = $transaction_list[transactionDate][i][j];
      if (elem.type == "I") {
        revenues += elem.value;
      } else {
        expenses += elem.value;
      }

      if (!elem.status) {
        if (elem.type == "I") {
          accounts_receivable.unshift(elem);
        } else {
          accounts_payable.unshift(elem);
        }
      }
    }
  }

  $("#dashboard-expenses").text(formatCurrency(expenses));
  $("#dashboard-revenues").text(formatCurrency(revenues));

  buildAccountsHtml("receivable", accounts_receivable);
  buildAccountsHtml("payable", accounts_payable);
}

function buildAccountsHtml(type, list) {
  var html = ``;

  if (list.length > 0) {
    for (var i in list) {
      const elem = list[i];
      const category = getCategotyInfo(elem.type, elem.category_id);

      var colorStatus = "#fff";
      if (!elem.status) {
        var date1 = new Date(elem.date + "T00:00:00");
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

      html += `<div class="d-flex aligm-itens-center-justify-content-between p-2 rounded ${
        i == list.length - 1 ? "" : "mb-3"
      }" style="background: ${colorStatus} " >`;
      html += ` <div class="category me-2" style="flex: 1;">`;
      html += `   <div class="category-icon" title="${category.name}" style="background:${category.color}50;color:${category.color}"><span class="sap-icons">&#${category.icon};</span></div>`;
      html += `   <div class="category-name">${elem.name} <p class="mb-0">${
        date1.getDate() > 9 ? date1.getDate() : "0" + date1.getDate()
      }/${date1.getMonth() + 1}/${date1.getFullYear()}</p></div>`;
      html += ` </div>`;
      html += ` <div class="w-25 d-flex align-items-center justify-content-end">`;
      html += `   <div class="text-bold ${
        elem.type == "I" ? "text-success" : "text-danger"
      }">${formatCurrency(elem.value)}</div>`;

      html += ` </div>`;
      html += `</div>`;
    }
    html += `<p class="mb-0 mt-3 text-center"><a href="/transactions">ver mais</a></p>`;
  } else {
    html += `<div class="alert alert-secondary">`;
    html += ` <div class="alert-content">`;
    html += `   <div class="alert-title">${$i18n.error_expression}</div>`;
    html += `   <div class="alert-text">${$i18n.no_results}</div>`;
    html += ` </div>`;
    html += `</div>`;
  }
  $(`#accounts-${type}`).html(html);
}
