"use strict";

let todoCtr = 0;
let editMode = false;
const addBtnText = "Add TODO!";

$(document).ready(function() {
  const $todoBtn = $("#todo-add");
  const $todoInput = $("#todo-input");
  const $todoList = $("#todo-list");
  const $completedList = $("#completed-list");

  let selectedTODO = null;

  $todoInput.keyup(function(e){
    if(e.keyCode == 13)
    {
        $todoBtn.trigger("click");
    }
});
  $todoBtn.click(() => {
    if ($todoInput.val()) {
      if(editMode){
        $(`#${selectedTODO}`).children('span').text($todoInput.val());
        editMode = false;
        selectedTODO = null;
        $todoInput.val("");
        $todoBtn.text(addBtnText);
      }else{
        createTODO($todoInput.val());
      }
    }
  });

  $(document).on('click', '.edit-todo', function(){
    editTODO($(this));
  });

  $(document).on('click', '.delete-todo', function(){
      $(this).closest('div').fadeOut(300, function() { $(this).remove(); });
      selectedTODO = null;
      $todoInput.val("");
  });

  $(document).on('change', 'input[type=checkbox]', function(){
      $todoInput.val("");
      $todoBtn.text(addBtnText);
      if($(this).is(":checked")){
        completeTODO($(this));
        return;
      }
      uncompleteTODO($(this));
  });

  function createTODO(newTodo) {
    todoCtr++;
    $todoList.append(`
      <div id="todo-${todoCtr}" class="todo clearfix">
        <input type="checkbox">
        <span>${newTodo}</span>
        <button class="btn btn-danger btn-sm delete-todo pull-right">delete</button>
        <button type="button" class="btn btn-secondary btn-sm edit-todo pull-right">edit</button>
      </div>
      `);
    $todoInput.val("");
  }

  function editTODO(el) {
    editMode = true;
    selectedTODO = el.parent().attr('id');
    let todoText = el.parent().children('span').text();
    $todoInput.val(todoText.trim());
    $todoInput.focus();
    $todoBtn.text("Submit");
  }

  function completeTODO(el) {
    $completedList.append(el.parent());
    el.parent().hide().fadeIn(500);
    selectedTODO = el.parent().attr('id');
    el.siblings('span').addClass('strike-through');
    el.siblings('button').hide();
  }

  function uncompleteTODO(el) {
    $todoList.append(el.parent());
    el.parent().hide().fadeIn(500);
    selectedTODO = el.parent().attr('id');
    el.siblings('span').removeClass('strike-through');
    el.siblings('button').show();
  }
});
