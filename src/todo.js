
class Todo {
    constructor(title, description, priority, dueDate, taskId = Date.now()) {
      this.title = title;
      this.description = description;
      this.priority = priority;
      this.dueDate = dueDate;
      this.taskId = taskId;
      this.isCompleted = false;
    }
    markCompleted() {
      if (this.isCompleted === false) {
        this.isCompleted = true;
      } else {
        this.isCompleted = false;
      }
    }
  
    editDetails(title, description, priority, dueDate) {
      this.title = title;
      this.description = description;
      this.priority = priority;
      this.dueDate = dueDate;
    }
  }
  
  export { Todo };
  