document.addEventListener("DOMContentLoaded", loadTasks);

let sortState = {
  name: "asc",
  completed: "asc",
};

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskDescription = taskInput.value.trim();

  if (taskDescription) {
    const task = {
      description: taskDescription,
      completed: false,
    };

    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);

    taskInput.value = "";
    displayTasks(tasks);
  }
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks(tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    const textContainer = document.createElement("div");
    textContainer.className = "text-container";

    const taskText = document.createElement("span");
    taskText.className = "task-text" + (task.completed ? " completed" : "");
    taskText.innerText = task.description;
    taskText.onclick = () => toggleTask(index);

    textContainer.appendChild(taskText);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    if (task.description.length > 19) {
      const moreBtn = document.createElement("button");
      moreBtn.className = "more-btn";
      moreBtn.innerHTML = '<i class="fas fa-eye"></i>';
      moreBtn.onclick = () => openPopup(task.description);
      buttonContainer.appendChild(moreBtn);
    }

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.onclick = () => openEditPopup(index, task.description);
    buttonContainer.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.onclick = () => deleteTask(index);
    buttonContainer.appendChild(deleteBtn);

    taskItem.appendChild(textContainer);
    taskItem.appendChild(buttonContainer);

    taskList.appendChild(taskItem);
  });
}

function openPopup(taskDescription) {
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");
  popupContent.innerText = taskDescription;
  popup.style.display = "flex";
}

function openEditPopup(index, currentDescription) {
  const editPopup = document.getElementById("edit-popup");
  const editInput = document.getElementById("edit-input");
  editInput.value = currentDescription;
  editPopup.style.display = "flex";

  const saveBtn = document.getElementById("save-edit");
  saveBtn.onclick = () => saveEdit(index);
}

function saveEdit(index) {
  const newDescription = document.getElementById("edit-input").value.trim();
  if (newDescription) {
    const tasks = getTasks();
    tasks[index].description = newDescription;
    saveTasks(tasks);
    displayTasks(tasks);
  }
  closeEditPopup();
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function closeEditPopup() {
  document.getElementById("edit-popup").style.display = "none";
}

function toggleTask(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  displayTasks(tasks);
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  displayTasks(tasks);
}

function loadTasks() {
  displayTasks(getTasks());
  updateSortIcons();
}

function sortTasks(criteria) {
  let tasks = getTasks();

  const isAscending = sortState[criteria] === "asc";
  sortState[criteria] = isAscending ? "desc" : "asc";

  if (criteria === "name") {
    tasks.sort((a, b) =>
      isAscending
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description)
    );
  } else if (criteria === "completed") {
    tasks.sort((a, b) =>
      isAscending ? a.completed - b.completed : b.completed - a.completed
    );
  }

  saveTasks(tasks);
  displayTasks(tasks);
  updateSortIcons();
}

function updateSortIcons() {
  const nameSortBtn = document.getElementById("sort-name-btn");
  const completedSortBtn = document.getElementById("sort-completed-btn");

  nameSortBtn.innerHTML =
    sortState.name === "asc"
      ? '<i class="fas fa-sort-alpha-down"></i>'
      : '<i class="fas fa-sort-alpha-up"></i>';

  completedSortBtn.innerHTML =
    sortState.completed === "asc"
      ? '<i class="fas fa-check-circle"></i>'
      : '<i class="fas fa-times-circle"></i>';
}
