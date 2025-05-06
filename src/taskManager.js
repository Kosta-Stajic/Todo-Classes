import { Todo } from "./todo";


    class taskManager {
    constructor () {
        this.todos = []
    }

    addTask (title,description, priority, dueDate) {
      const newTask = new Todo (title, description, priority, dueDate)
        this.todos.push(newTask)
        return newTask
    }

    removeTask (task) {
        this.todos = this.todos.filter(t => t !==task)
    }

    editTask (task) {
        task.editDetails(title,description, priority, dueDate)
    }

    isCompleted (task){
        task.markCompleted()

    }

}

//random comment



export {taskManager}