var $isCreateOrUpdate = "create";
var $updateId = null;

$(document).ready(function () {
  $("#pills-expenses-tab").click(function () {
    $currentTab = "expenses";
  });

  $("#pills-revenues-tab").click(function () {
    $currentTab = "revenues";
  });

  $(document).on("click", ".btn-remove-category", function () {
    var id = $(this).attr("data-id");
    dealRemoveCategory(id);
  });

  $(document).on("click", ".btn-edit-category", function () {
    var id = $(this).attr("data-id");
    dealUpdateCategory(id);
  });

  $("#btn-modal-category").click(function () {
    dealCreateCategory();
  });

  $(".color-item").click(function () {
    dealChangeColor($(this));
  });

  $(".icon-item").click(function () {
    dealChangeIcon($(this));
  });

  $("#btn-save-category").click(function () {
    dealSaveCategory();
  });

  dealShowCategories();
});

function dealUpdateCategory(id) {
  var category = null;
  for (var type in $category_list) {
    for (var item in $category_list[type]) {
      if ($category_list[type][item].category_id == id) {
        category = $category_list[type][item];
        break;
      }
    }
  }

  if (category == null) {
    new Notify({
      title: $i18n.error_expression,
      text: $i18n.category_not_found,
      status: "error",
    });
  } else {
    resetFormCategory();
    $isCreateOrUpdate = "update";
    $updateId = id;
    $("#modal-category-label").html(
      `<span class="sap-icons me-1">&#xe038;</span>${$i18n.category}`
    );
    $("#form-category\\[name\\]").val(category.name);
    $("#form-category\\[type\\]").val(category.type);
    $("#form-category\\[icon\\]").val(category.icon);
    $("#modal-category-icon").html(`&#${category.icon};`);
    $(".icon-item").removeClass("active");
    $(`#icon-item-${category.icon}`).addClass("active");
    $("#form-category\\[color\\]").val(category.color);
    $(".color-item").removeClass("active");
    $(`#color-item-\\${category.color}`).addClass("active");
    $("#modal-category-div").css("background", `${category.color}50`);
    $("#modal-category-div").css("color", `${category.color}`);
    $("#modal-category").modal("show");
  }
}

function dealCreateCategory() {
  resetFormCategory();
  $("#form-category\\[type\\]").val($currentTab == "expenses" ? "O" : "I");
  $("#modal-category-label").html(
    `<span class="sap-icons me-1">&#xe058;</span>${$i18n.category}`
  );
  $("#modal-category").modal("show");
}

function dealSaveCategory() {
  if (isValidCategory()) {
    if ($isCreateOrUpdate == "update") {
      updateCategory();
    } else {
      createCategory();
    }
  }
}

function updateCategory() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/category/update/${$updateId}`,
    data: $("#form-category").serialize(),
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "PUT",
    complete: function (result) {
      if (result.status == 200) {
        new Notify({
          title: $i18n.success_expression,
          text: result.responseJSON.message,
          status: "success",
          autotimeout: 2000,
        });
        $("#modal-category").modal("hide");
        loadCategories();
      }
    },
  });
}

function createCategory() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/category/create`,
    data: $("#form-category").serialize(),
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "POST",
    complete: function (result) {
      if (result.status == 200) {
        new Notify({
          title: $i18n.success_expression,
          text: result.responseJSON.message,
          status: "success",
          autotimeout: 2000,
        });
        $("#modal-category").modal("hide");
        loadCategories();
      }
    },
  });
}

function isValidCategory() {
  var valid = true;

  if ($("#form-category\\[name\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.category_name_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if (["I", "O"].indexOf($("#form-category\\[type\\]").val().trim()) == -1) {
    valid = false;
    new Notify({
      title: $i18n.category_type_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if ($("#form-category\\[color\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.category_color_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if ($("#form-category\\[icon\\]").val().trim() == "") {
    valid = false;
    new Notify({
      title: $i18n.category_icon_field,
      text: $i18n.field_required,
      status: "error",
    });
  }

  if ($isCreateOrUpdate == "update" && $updateId == null) {
    valid = false;
    new Notify({
      text: $i18n.category_id_missing,
      status: "error",
    });
  }

  return valid;
}

function dealChangeColor(elem) {
  var color = elem.attr("data-id");
  $("#form-category\\[color\\]").val(color);
  $(".color-item").removeClass("active");
  elem.addClass("active");
  $("#modal-category-div").css("background", `${color}50`);
  $("#modal-category-div").css("color", `${color}`);
}

function dealChangeIcon(elem) {
  var icon = elem.attr("data-id");
  $("#form-category\\[icon\\]").val(icon);
  $(".icon-item").removeClass("active");
  elem.addClass("active");
  $("#modal-category-icon").html(`&#${icon};`);
}

function resetFormCategory() {
  $isCreateOrUpdate = "create";
  $updateId = null;

  $("#form-category\\[name\\]").val("");
  $("#form-category\\[icon\\]").val($icons[0]);
  $("#modal-category-icon").html(`&#${$icons[0]};`);
  $(".icon-item").removeClass("active");
  $(`#icon-item-${$icons[0]}`).addClass("active");

  $("#form-category\\[color\\]").val($colors[0]);
  $(".color-item").removeClass("active");
  $(`#color-item-\\${$colors[0]}`).addClass("active");
  $("#modal-category-div").css("background", `${$colors[0]}50`);
  $("#modal-category-div").css("color", `${$colors[0]}`);
}

function dealRemoveCategory(id) {
  Swal.fire({
    icon: "warning",
    confirmButtonColor: "#db9357",
    text: $i18n.swal_remove_category_text,
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonText: $i18n.remove_button,
    cancelButtonText: $i18n.cancel_text,
  }).then((result) => {
    if (result.isConfirmed) {
      removeCategory(id);
    }
  });
}

function removeCategory(id) {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/category/delete/${id}`,
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    method: "DELETE",
    complete: function (result) {
      if (result.status == 200) {
        new Notify({
          title: $i18n.success_expression,
          text: result.responseJSON.message,
          status: "success",
        });
        setCategoryList(result.responseJSON.category_list);
        dealShowCategories();
      }
    },
  });
}

function loadCategories() {
  $.ajax({
    url: `${$config.endpoind_api_gateway}/api/category/list`,
    headers: {
      "Accept-Language": $config.locale,
      Authorization: `Bearer ${getCookie("moneezy_token")}`,
    },
    skipAjaxComplete: true,
    method: "GET",
    complete: function (result) {
      if (result.status == 200) {
        setCategoryList(result.responseJSON.category_list);
        dealShowCategories();
      } else {
        setCategoryList({ I: [], O: [] });
        showError(result.responseJSON);
      }
    },
  });
}

function setCategoryList(list) {
  $category_list = list;
  setCookie("moneezy_categories", JSON.stringify(list));
}

function showError(data) {
  var html = ``;
  html += `<div class="alert alert-danger">`;
  html += ` <div class="alert-content">`;
  html += `   <div class="alert-title">${$i18n.error_expression}</div>`;
  html += `   <div class="alert-text">${data.code} - ${data.message}</div>`;
  html += ` </div>`;
  html += `</div>`;
  $(`#pills-expenses, #pills-revenues`).html(html);
}

function dealShowCategories() {
  showCategories("I", "revenues");
  showCategories("O", "expenses");
}

function showCategories(type, div) {
  var html = ``;
  if ($category_list[type].length > 0) {
    html += `<ul class="list-group list-group-flush">`;
    for (var i in $category_list[type]) {
      const category = $category_list[type][i];
      html += ` <li class="list-group-item d-flex align-items-center justify-content-between">`;
      html += `   <div class="category me-2">`;
      html += `     <div class="category-icon" style="background:${category.color}50;color:${category.color}"><span class="sap-icons">&#${category.icon};</span></div>`;
      html += `     <div class="category-name">${category.name}</div>`;
      html += `   </div>`;
      html += `   <div>`;
      html += `     <button class="btn btn-sm btn-highlight btn-edit-category" data-id="${category.category_id}"><span class="sap-icons">&#xe038;</span></button>`;
      html += `     <button class="btn btn-sm btn-danger btn-remove-category" data-id="${category.category_id}"><span class="sap-icons">&#xe03d;</span></button>`;
      html += `   </div>`;
      html += ` </li>`;
    }
    html += `</ul>`;
  } else {
    html += `<div class="alert alert-secondary">`;
    html += ` <div class="alert-content">`;
    html += `   <div class="alert-title">${$i18n.error_expression}</div>`;
    html += `   <div class="alert-text">${$i18n.no_results}</div>`;
    html += ` </div>`;
    html += `</div>`;
  }
  $(`#pills-${div}`).html(html);
}
