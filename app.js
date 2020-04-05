'use strict';

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
        var newTodo = new Todo(createId(), description);
        todos.push(newTodo);
        return newTodo;
      }
    },

    deleteTodo: function (element) {
      if (element) {
        var id = element.getAttribute('data-id');

        for (var i = 0; i < todos.length; i++) {
          if (todos[i].id == id) {
            todos.splice(i, 1);
            break;
          }
        }
      }
    },

    countTodos: function () {
      return todos.length;
    },

    countCompletedTodos: function () {
      var nb = todos.reduce(function (n, val) {
        return n + (val.completed === true);
      }, 0);
      return nb;
    },

    countleftTodos: function () {
      return this.countTodos() - this.countCompletedTodos();
    },

    completeTodo: function (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
          todos[i].completed = true;
          break;
        }
      }
    },

    uncompleteTodo: function (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
          todos[i].completed = false;
          break;
        }
      }
    },

    filterCompleted: function () {
      return todos.filter((t) => t.completed);
    },

    filterLeft: function () {
      return todos.filter((t) => !t.completed);
    },

    filterAll: function () {
      return todos;
    },
    testing: function () {
      console.log(todos);
    },
  };
})();

// User Interface controller
var UIController = (function () {
  var DOMstrings = {
    todoInput: '#add__todo',
    todoList: '#to-dos__list',
    todo: '.list-group-item',
    allTodos: '#all-todos',
    allCompleted: '#all-completed',
    alleft: '#all-left',
    allTodoslink: '.all-todos-link',
    allCompletedLink: '.all-completed-todos-link',
    allLeftLink: '.all-left-todos-link',
  };

  var clearTodoList = function () {
    document.querySelector(DOMstrings.todoList).innerHTML = '';
  };

  return {
    getDOMstrings: function () {
      return DOMstrings;
    },

    clearInput: function () {
      document.querySelector(DOMstrings.todoInput).value = '';
    },

    addTodo: function (todo) {
      if (todo) {
        var html = `
          <li 
            class="list-group-item" 
            data-id=${todo.id}> ${todo.description}
            <span class="delete"> x </span>
          </li>
        `;
        document
          .querySelector(DOMstrings.todoList)
          .insertAdjacentHTML('beforeend', html);
      }
    },

    deleteTodo: function (todo) {
      if (todo) {
        todo.parentNode.removeChild(todo);
      }
    },

    updateAllTodos: function (numberToDisplay) {
      if (numberToDisplay >= 0) {
        document.querySelector(DOMstrings.allTodos).innerHTML = numberToDisplay;
      }
    },

    updateCompletedTodos: function (nbToDisplay) {
      document.querySelector(DOMstrings.allCompleted).innerHTML = nbToDisplay;
    },

    updateLeftTodos: function (nbToDisplay) {
      document.querySelector(DOMstrings.alleft).innerHTML = nbToDisplay;
    },

    filterTodos: function (todos) {
      if (todos) {
        clearTodoList();
        todos.forEach((element) => {
          this.addTodo(element);
        });
      }
    },
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function (UICtrl, todoCtrl) {
  var DOM = UICtrl.getDOMstrings();

  var setupEventListeners = function () {
    document.addEventListener('keypress', function (event) {
      var returnKeyNumber = 13;
      if (
        event.keyCode === returnKeyNumber ||
        event.which === returnKeyNumber
      ) {
        addItem();
      }
    });

    // document.querySelector(DOM.todoList).addEventListener('dblclick', deleteItem);
    document
      .querySelector(DOM.todoList)
      .addEventListener('click', handleTodoListClick);
    document
      .querySelector(DOM.allCompletedLink)
      .addEventListener('click', filterCompletedTodos);
    document
      .querySelector(DOM.allTodoslink)
      .addEventListener('click', filterAllTodos);
    document
      .querySelector(DOM.allLeftLink)
      .addEventListener('click', filterLeftTodos);
  };

  var addItem = function () {
    var description = document.querySelector(DOM.todoInput).value;
    if (description) {
      // add the todo to the todoController
      var newTodo = todoCtrl.addTodo(description);

      // add the item to the UI
      UICtrl.addTodo(newTodo);

      // update badges
      updateBadges();

      // clear the fields
      UICtrl.clearInput();
    }
  };

  var handleTodoListClick = function (event) {
    var deleteClassName = 'delete';
    var listClassName = 'list-group-item';

    if (event.target.className === deleteClassName) {
      deleteItem(event.target.parentNode);
    } else if (event.target.classList.contains(listClassName)) {
      completeTodo(event.target);
    }
  };

  var deleteItem = function (element) {
    todoCtrl.deleteTodo(element);
    UICtrl.deleteTodo(element);
    updateBadges();
  };

  var completeTodo = function (element) {
    if (element) {
      var id = element.getAttribute('data-id');
      if (element.classList.contains('completed')) {
        todoCtrl.uncompleteTodo(id);
      } else {
        todoCtrl.completeTodo(id);
      }
      element.classList.toggle('completed');
      updateBadges();
    }
  };

  var filterCompletedTodos = function () {
    let todos = todoCtrl.filterCompleted();
    if (todos) {
      UIController.filterTodos(todos);
    }
  };

  var filterAllTodos = function () {
    let todos = todoCtrl.filterAll();
    if (todos) {
      UIController.filterTodos(todos);
    }
  };

  var filterLeftTodos = function () {
    let todos = todoCtrl.filterLeft();
    if (todos) {
      UIController.filterTodos(todos);
    }
  };

  var updateBadges = function () {
    UICtrl.updateAllTodos(todoCtrl.countTodos());
    UICtrl.updateCompletedTodos(todoCtrl.countCompletedTodos());
    UICtrl.updateLeftTodos(todoCtrl.countleftTodos());
  };

  return {
    init: function () {
      console.log(' application has started');
      setupEventListeners();
    },
  };
})(UIController, todoController);

controller.init();
