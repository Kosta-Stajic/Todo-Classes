import { taskManager } from "./taskManager";
import editImgPath from "./edit.svg";
import delImgPath from "./delete.svg";
import { format, isToday, parseISO } from "date-fns";

const mainBar = document.querySelector(".main-bar");

class DomManipulation {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.renderAllTasks(); // Render tasks from localStorage on initialization
  }

  // Render all tasks from taskManager
  renderAllTasks() {
    // Clear existing tasks from the DOM
    const existingTasks = mainBar.querySelectorAll(".todoCards");
    existingTasks.forEach((task) => task.remove());

    // Render each task from the task manager
    this.taskManager.todos.forEach((taskData) => {
      this.renderTasks(taskData, mainBar);

      // If task was completed, check the checkbox
      if (taskData.isCompleted) {
        const taskElement = document.querySelector(
          `.todoCards[data-id="${taskData.taskId}"]`,
        );
        const checkbox = taskElement.querySelector(".checkmark");
        checkbox.checked = true;
        taskElement.classList.add("checked");
      }
    });
  }

  openNewDialog() {
    const dialog = document.querySelector(".popUp");
    const addNew = document.querySelector(".add");
    addNew.addEventListener("click", () => {
      const form = document.createElement("form");
      form.className = "dynamic-form";
      form.innerHTML = `
            <textarea id="title" placeholder="Title"></textarea>
            <textarea id="description" placeholder="Description"></textarea>
            <div class="radioButtons">
                <label>Priority:</label>
                <input type="radio" id ="low" name="priority" value="low"> 
                <input type="radio" id ="medium" name="priority" value="medium"> 
                <input type="radio" id ="high" name="priority" value="high"> 
            </div>
            <input type="date" id="dueDate">
            <button type="submit" id="submit">Add Task</button> `;

      this.handleFormSubmit(form, dialog, false);
      dialog.appendChild(form);
      dialog.showModal();

      //focus text
      const titleInput = document.querySelector("#title");
      titleInput.focus(); // Focus the textarea
    });
  }

  handleFormSubmit(form, dialog, isEditMode = false, taskData) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = document.querySelector("#title").value;
      const description = document.querySelector("#description").value;
      const priority = document.querySelector(
        `input[name="priority"]:checked`,
      ).value;
      const dueDate = document.querySelector("#dueDate").value;

      if (!isEditMode) {
        const taskData = this.taskManager.addTask(
          title,
          description,
          priority,
          dueDate,
        );
        this.renderTasks(taskData, mainBar);
      } else {
        const existingTask = this.taskManager.todos.find(
          (todo) => todo.taskId === taskData.taskId,
        );
        const oldCardElement = document.querySelector(
          `.todoCards[data-id="${taskData.taskId}"]`,
        );
        if (existingTask) {
          existingTask.editDetails(title, description, priority, dueDate);
          this.taskManager.saveToLocalStorage(); // Save changes to localStorage
          if (oldCardElement) {
            oldCardElement.remove();
          }
          this.renderTasks(existingTask, mainBar);
        }
      }
      form.remove();
      dialog.close();
    });
  }

  editDialog(taskData) {
    const dialog = document.querySelector(".popUp");

    const form = document.createElement("form");
    form.className = "dynamic-form";
    form.innerHTML = `
            <textarea id="title" placeholder="Title">${taskData.title}</textarea>
            <textarea id="description" placeholder="Description">${taskData.description}</textarea>
            <div class="radioButtons">
                <label>Priority:</label>
                <input type="radio" id ="low" name="priority" value="low" ${taskData.priority === "low" ? "checked" : ""}> 
                <input type="radio" id ="medium" name="priority" value="medium" ${taskData.priority === "medium" ? "checked" : ""}> 
                <input type="radio" id ="high" name="priority" value="high" ${taskData.priority === "high" ? "checked" : ""}> 
            </div>
            <input type="date" id="dueDate" value = ${taskData.dueDate}>
            <button type="submit" id="submit">Update Task</button> `;

    this.handleFormSubmit(form, dialog, true, taskData);
    dialog.appendChild(form);
    dialog.showModal();

    //focus text to the end
    const titleInput = document.querySelector("#title");
    titleInput.focus(); // Focus the textarea
    titleInput.setSelectionRange(
      titleInput.value.length,
      titleInput.value.length,
    );
  }

  //renders the tasks in the DOM
  renderTasks(taskData, container) {
    const toDoCard = document.createElement("div");
    toDoCard.classList.add("todoCards");
    container.appendChild(toDoCard);

    toDoCard.setAttribute("data-title", taskData.title);
    toDoCard.setAttribute("data-description", taskData.description);
    toDoCard.setAttribute("data-priority", taskData.priority);
    toDoCard.setAttribute("data-dueDate", taskData.dueDate);
    toDoCard.setAttribute("data-id", taskData.taskId);

    // Create checkbox with unique identifier
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkmark");

    // Set checkbox state based on task completion status
    if (taskData.completed) {
      checkbox.checked = true;
      toDoCard.classList.add("checked");
    }

    // Create span for title
    const titleSpan = document.createElement("span");
    titleSpan.classList.add("title");
    titleSpan.textContent = taskData.title;

    // Append elements
    toDoCard.appendChild(checkbox);
    toDoCard.appendChild(titleSpan);

    //activate methods
    this.createButtons(toDoCard, taskData);
    this.taskDone(toDoCard, checkbox, taskData);

    //add classes to change background for each task
    if (toDoCard.dataset.priority) {
      toDoCard.classList.add(`${toDoCard.dataset.priority}-priority`);
    }
  }

  //adds line through and opacity to the task
  taskDone(element, checkbox, taskData) {
    checkbox.addEventListener("change", () => {
      element.classList.toggle("checked");
      this.taskManager.isCompleted(taskData);
      console.log(task.todos);
    });
  }

  createButtons(element, taskObject) {
    //details button
    const detailsButton = document.createElement("button");
    detailsButton.classList.add("details");
    detailsButton.textContent = "details";
    element.appendChild(detailsButton);

    //details eventListeners
    detailsButton.addEventListener("click", () => {
      const detailsDialog = document.createElement("dialog");
      detailsDialog.classList.add("detailsPopUp");
      mainBar.appendChild(detailsDialog);
      detailsDialog.innerHTML = `<h1>${taskObject.title}</h1>
                <p class="descriptionDialog"> Description: ${taskObject.description}</p>
                <p class="priorityDialog"> Priority: ${taskObject.priority}</p>
                <p class="dueDateDialog"> due Date: ${format(parseISO(taskObject.dueDate), "PPP")}</p>
                <button class="close">x</button>`;
      detailsDialog.showModal();

      //closeButton event
      const closeButton = document.querySelectorAll(".close");
      closeButton.forEach((button) => {
        button.addEventListener("click", () => {
          detailsDialog.close();
        });
      });
    });

    //delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    element.appendChild(deleteButton);
    deleteButton.addEventListener("click", (e) => {
      mainBar.removeChild(e.target.closest(".todoCards"));
      this.taskManager.removeTask(taskObject);
    });

    //delete img
    const deleteImg = document.createElement("img");
    deleteImg.classList.add("deleteImg");
    deleteImg.src = delImgPath;
    deleteButton.appendChild(deleteImg);

    //edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    element.appendChild(editButton);
    //editButton event
    editButton.addEventListener("click", () => {
      this.editDialog(taskObject);
    });

    //edit img
    const editImg = document.createElement("img");
    editImg.classList.add("editImg");
    editImg.src = editImgPath;
    editButton.appendChild(editImg);
  }

  // Add a method to clear all tasks
  clearAllTasks() {
    this.taskManager.clearLocalStorage();
    const existingTasks = mainBar.querySelectorAll(".todoCards");
    existingTasks.forEach((task) => task.remove());
  }
}

const task = new taskManager();
const init = new DomManipulation(task);

export { init };
