const addForm = document.querySelector('.add');
const list = document.querySelector('.todos');
const search = document.querySelector('.search input');

// Function to retrieve todos from local storage
const getTodosFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('todos')) || [];
};

// Function to store todos in local storage
const storeTodosInLocalStorage = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

// Function to generate the HTML template for a todo
const generateTemplate = (todo) => {
  const html = `
    <li class="list-group-item text-light d-flex justify-content-between align-items-center">
      <span>${todo}</span>
      <i class="far fa-trash-alt delete"></i>
    </li>
  `;
  list.innerHTML += html;
};

// Function to add a new todo
const addTodo = (todo) => {
  const todos = getTodosFromLocalStorage();
  todos.push(todo);
  storeTodosInLocalStorage(todos);
  generateTemplate(todo);
};

// Function to remove a todo
const removeTodo = (todoElement) => {
  const todo = todoElement.firstChild.textContent;
  const todos = getTodosFromLocalStorage();
  const updatedTodos = todos.filter((item) => item !== todo);
  storeTodosInLocalStorage(updatedTodos);
  todoElement.remove();
};

// Event listener for adding a new todo
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const todoInput = addForm.add;
  const todo = todoInput.value.trim();

  if (todo.length > 0) {
    addTodo(todo);
    todoInput.value = '';
  }
});

// Event listener for removing a todo
list.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const todoElement = e.target.parentElement;
    removeTodo(todoElement);
  }
});

// Function to filter todos based on the search term
const filterTodos = (term) => {
  const todos = Array.from(list.children);
  todos.forEach((todo) => {
    const todoText = todo.firstChild.textContent.toLowerCase();
    if (todoText.includes(term)) {
      todo.style.display = 'flex';
    } else {
      todo.style.display = 'none';
    }
  });
};



// Event listener for filtering todos
search.addEventListener('keyup', () => {
  const term = search.value.trim().toLowerCase();
  filterTodos(term);
});

const initTodos = () => {
  const todos = getTodosFromLocalStorage();
  list.textContent = ''; // Clear the HTML list

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'text-light', 'd-flex', 'justify-content-between', 'align-items-center');
  
    const span = document.createElement('span');
    span.textContent = todo;
  
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('far', 'fa-trash-alt', 'delete');
  
    li.appendChild(span);
    li.appendChild(deleteIcon);
  
    list.appendChild(li);
  });
};


// Initialize the todos on page load
initTodos();
