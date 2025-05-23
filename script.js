const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

let tasks = [];

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    // Only keep valid tasks with text
    tasks = saved.filter(task => task && typeof task.text === 'string' && task.text.trim() !== '');
  } catch (err) {
    tasks = [];
    localStorage.removeItem('tasks'); // Clean up corrupted data
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span contenteditable="true" onblur="editTask(${index}, this)" class="task-text">${task.text}</span>
      <div class="actions">
        <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Done'}</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function addTask(e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText === '') return;
  tasks.push({ text: taskText, completed: false });
  saveTasks();
  input.value = '';
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index, element) {
  const newText = element.innerText.trim();
  if (newText !== '') {
    tasks[index].text = newText;
  } else {
    // If user erases text, keep old one
    element.innerText = tasks[index].text;
  }
  saveTasks();
}

form.addEventListener('submit', addTask);
loadTasks();
renderTasks();
