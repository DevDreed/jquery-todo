"use strict";


let apiKeys = {};
let uid = "";

function putTodoInDOM() {
  FbAPI.getTodos(apiKeys, uid).then(function (items) {
    $('#completed-tasks').html("");
    $('#incomplete-tasks').html("");
    items.map((item)=>{
      if(item.isCompleted === true){
          let newListItem = `<li data-completed="${item.isCompleted}">`;
          newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
          newListItem+='<input class="checkboxStyle" type="checkbox" checked>';
          newListItem+=`<label class="inputLabel">${item.task}</label>`;
          newListItem+='<input type="text" class="inputTask">';
          newListItem+='</div>';
          newListItem+='</li>';
          //apend to list
          $('#completed-tasks').append(newListItem);
        } else {
          let newListItem = `<li data-completed="${item.isCompleted}">`;
          newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
          newListItem+='<input class="checkboxStyle" type="checkbox">';
          newListItem+=`<label class="inputLabel">${item.task}</label>`;
          newListItem+='<input type="text" class="inputTask">';
          newListItem+='</div>';
          newListItem+='<div class="col-xs-4">';
          newListItem+=`<button class="btn btn-default col-xs-6 edit" data-fbid="${item.id}">Edit</button>`;
          newListItem+=`<button class="btn btn-danger col-xs-6 delete" data-fbid="${item.id}">Delete</button> `;
          newListItem+='</div>';
          newListItem+='</li>';
          //apend to list
          $('#incomplete-tasks').append(newListItem);
        }
    });
  });
}

function createLogoutButton() {
  FbAPI.getUser(apiKeys, uid).then(function (userResponse) {
    $('#logout-container').html('');
    let currentUsername = userResponse.username;
    let logoutButton = `<button class="btn btn-danger" id="logoutButton">Logout ${currentUsername}</button>`;
    $('#logout-container').append(logoutButton);
  });
}

$(document).ready(function() {

  FbAPI.firebaseCredentials().then(function (keys) {
    console.log("keys", keys);
    apiKeys = keys;
    firebase.initializeApp(apiKeys);
  });

  $('#add-todo-button').on('click', function () {
    let newItem = {
      "uid": uid,
      "task": $('#add-todo-text').val(),
      "isCompleted": false
    };

    FbAPI.addTodo(apiKeys, newItem).then(function () {
      putTodoInDOM();
    });
  });

  $("ul").on('click', '.delete', function () {
    let itemId = $(this).data("fbid");
    FbAPI.deleteTodo(apiKeys, itemId).then(function () {
      putTodoInDOM();
    });
  });

  $("ul").on('click', '.edit', function () {
    let itemId = $(this).data("fbid");
    let parent = $(this).closest("li");
    if(!parent.hasClass("editMode")){
      parent.addClass("editMode");
    }else{
      let editedItem = {
        "uid": uid,
        "task": parent.find(".inputTask").val(),
        "isCompleted": false
      };

      FbAPI.editTodo(apiKeys, itemId, editedItem).then(function (response) {
        parent.removeClass("editMode");
        console.log(response);
        putTodoInDOM();
      });
    }
  });

  $("ul").on('change', 'input[type="checkbox"]', function () {
    let updatedIsCompleted = $(this).closest("li").data("completed");
    let itemId = $(this).parent().data("fbid");
    let task  = $(this).siblings(".inputLabel").html();
    let editedItem = {
      "uid": uid,
      "task": task,
      "isCompleted": !updatedIsCompleted
    };

    FbAPI.editTodo(apiKeys, itemId, editedItem).then(
      function () {
        putTodoInDOM();
      }
    );
  });

  $('#registerButton').on('click', function () {
    let email = $('#inputEmail').val();
    let password = $('#inputPassword').val();
    let username = $('#inputUsername').val();
    let user = {
      email: email,
      password: password
    };
    FbAPI.registerUser(user).then(function (registerResponse) {
      console.log('registerResponse', registerResponse);
      let newUser = {
        username,
        uid: registerResponse.uid
      };
      return FbAPI.addUser(apiKeys, newUser);
    })
    .then(function (userResponse) {
      return FbAPI.loginUser(user);
    })
    .then(function (loginResponse) {
      console.log("login response", loginResponse);
      uid = loginResponse.uid;
      createLogoutButton();
      putTodoInDOM();
      $('#login-container').addClass('hide');
      $('#todo-container').removeClass('hide');
    });
  });

  $('#loginButton').on('click', function () {
    let email = $('#inputEmail').val();
    let password = $('#inputPassword').val();
    let user = {
      email: email,
      password: password
    };

    FbAPI.loginUser(user).then(function (loginResponse) {
      console.log('loginResponse', loginResponse);
      uid = loginResponse.uid;
      createLogoutButton();
      putTodoInDOM();
      $('#login-container').addClass('hide');
      $('#todo-container').removeClass('hide');
    });
  });

  $("#logout-container").on('click', '#logoutButton', function () {
    FbAPI.logoutUser();
    uid ="";
    $('#incomplete-tasks').html('');
    $('#completed-tasks').html('');
    $('#inputEmail').val('');
    $('#inputPassword').val('');
    $('#inputUsername').val('');
    $('#login-container').removeClass('hide');
    $('#todo-container').addClass('hide');
  });

});
