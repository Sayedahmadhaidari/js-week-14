// Select HTML elements
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");
const filterButtons = document.querySelectorAll(".filter-btn");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load saved filter from localStorage
let currentFilter = localStorage.getItem("filter") || "All";

// Make sure the saved filter is valid
if (!["All", "Active", "Completed"].includes(currentFilter)) {
  currentFilter = "All";
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
  // Clear the task list
  taskList.innerHTML = "";

  // Filter tasks
  let filteredTasks = tasks.filter(function (task) {
    if (currentFilter === "Active") {
      return task.completed === false;
    }

    if (currentFilter === "Completed") {
      return task.completed === true;
    }

    return true;
  });

  // Display filtered tasks
  filteredTasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;

      saveTasks();
      renderTasks();
    });

    // Create task text
    const span = document.createElement("span");
    span.textContent = task.text;

    // Create remove button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", function () {
      tasks = tasks.filter(function (item) {
        return item.id !== task.id;
      });

      saveTasks();
      renderTasks();
    });

    // Add elements to the list
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  // Update task count
  taskCount.textContent = filteredTasks.length + " tasks";
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  tasks.push(newTask);

  saveTasks();

  taskInput.value = "";

  renderTasks();
});

// Handle filter buttons
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Get selected filter
    currentFilter = button.dataset.filter;

    // Save selected filter to localStorage
    localStorage.setItem("filter", currentFilter);

    // Update active button
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    // Display filtered tasks
    renderTasks();
  });
});

// Apply saved filter when the page loads
filterButtons.forEach(function (button) {
  button.classList.toggle("active", button.dataset.filter === currentFilter);
});

// Display tasks when the page loads
renderTasks();
