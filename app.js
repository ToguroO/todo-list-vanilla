'use strict'


var todoController = (function () {
  var Todo = function (id, description) {
    this.id = id;
    this.description = description;
    this.completed = false;
  };

  var todos = [],

    createId = function () {
      if (todos.length > 0) {
        return todos[todos.length - 1].id + 1;
      } else {
        return 0;
      }
    };

  return {
    addTodo: function (description) {
      if (description) {
        var id = createId();
        var newTodo = new Todo(createId(), description);
        todos.push(newTodo);
        return newTodo;
      }
    },

    deleteTodo: function (element) {
      if (element) {
        var id = element.getAttribute("data-id");
        if (id) {
          todos.splice(todos.indexOf(id), 1);
        }
      }
    },

    testing: function () {
      console.log(todos);
    }
  };

})();


// User Interface controller
var UIController = (function () {
  var DOMstrings = {
    todoInput: '#add__todo',
    todoList: '#to-dos__list'
  };

  return {
    getDOMstrings: function () {
      return DOMstrings;
    },

    clearInput: function () {
      document.querySelector(DOMstrings.todoInput).value = "";
    },

    addTodo: function (todo) {
      if (todo) {
        var html =
          `
          <li class="list-group-item" data-id=${todo.id}>${todo.description}</li>
        `
        document.querySelector(DOMstrings.todoList).insertAdjacentHTML('beforeend', html);
      }
    },

    deleteTodo: function (todo) {
      if (todo) {
        todo.parentNode.removeChild(todo);
      }
    },

  };

})();


// GLOBAL APP CONTROLLER
var controller = (function (UICtrl, todoCtrl) {
  var DOM = UICtrl.getDOMstrings();
  var setupeEventListeners = function () {

    document.addEventListener('keypress', function (event) {
      var returnKeyNumber = 13;
      if (event.keyCode === returnKeyNumber || event.which === returnKeyNumber) {
        addItem();
      }
    });

    document.querySelector(DOM.todoList).addEventListener('dblclick', deleteItem);

  };


  var addItem = function () {
    var description = document.querySelector(DOM.todoInput).value;
    if (description) {
      // add the todo to the todoController
      var newTodo = todoCtrl.addTodo(description);

      // add the item to the UI
      UICtrl.addTodo(newTodo);

      // clear the fields
      UICtrl.clearInput();
    }

  };

  var deleteItem = function (event) {
    if (event.target) {
      todoCtrl.deleteTodo(event.target);
      UICtrl.deleteTodo(event.target);
    }
  };


  return {
    init: function () {
      console.log(" application has started");
      setupeEventListeners();
    }
  };
})(UIController, todoController);

controller.init();


//TODO: SUPPRESSION ELEMENT TODOS INCORRECTE