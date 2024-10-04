const colorList = [
  "#7a7a7a",
  "#e23c3c",
  "#e26c3c",
  "#e2ad3c",
  "#9ae23c",
  "#3ce245",
  "#3ce28b",
  "#3ce2de",
  "#3cafe2",
  "#3c5fe2",
  "#933DE3",
  "#d73ce2",
  "#e23ca3",
];

const iconList = [
  "xe137",
  "xe0a6",
  "xe000",
  "xe0ae",
  "xe048",
  "xe062",
  "xe199",
  "xe197",
  "xe217",
  "xe045",
  "xe08b",
  "xe294",
  "xe083",
  "xe08a",
  "xe043",
  "xe087",
  "xe21d",
  "xe116",
  "xe1b3",
  "xe040",
  "xe0dc",
  "xe033",
  "xe0a1",
  "xe075",
  "xe164",
  "xe070",
  "xe024",
  "xe021",
  "xe0d5",
  "xe0d3",
  "xe105",
  "xe08f",
  "xe060",
  "xe0ca",
  "xe102",
  "xe101",
  "xe099",
  "xe00f",
  "xe00c",
  "xe0b3",
  "xe0fd",
  "xe0fc",
  "xe0fb",
  "xe13a",
  "xe1cc",
  "xe0af",
  "xe0fa",
  "xe0f9",
  "xe006",
  "xe12c",
];

function getFirstDaysOfMonths() {
  const result = [];

  // Data atual
  const currentDate = new Date();

  // Primeiro dia do mês atual
  const firstDayCurrent = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  result.push(firstDayCurrent.toISOString().split("T")[0]);

  // Primeiro dia do mês anterior
  const firstDayPrevious = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  result.unshift(firstDayPrevious.toISOString().split("T")[0]); // Adiciona no início do array

  // Primeiro dia do próximo mês
  const firstDayNext = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );
  result.push(firstDayNext.toISOString().split("T")[0]);

  return result;
}

module.exports = { colorList, iconList, getFirstDaysOfMonths };
