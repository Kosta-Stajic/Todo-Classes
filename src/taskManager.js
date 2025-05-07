import { Todo } from "./todo";


    class taskManager {
    constructor () {
        this.todos = []
        this.loadFromLocalStorage()
    }
    

    addTask (title,description, priority, dueDate) {
      const newTask = new Todo (title, description, priority, dueDate)
        this.todos.push(newTask)
        this.saveToLocalStorage()
        return newTask
    }

    removeTask (task) {
        this.todos = this.todos.filter(t => t !==task)
        this.saveToLocalStorage()
    }

    editTask (task) {
        task.editDetails(title,description, priority, dueDate)
        this.saveToLocalStorage()
    }

    isCompleted (task){
        task.markCompleted()
        this.saveToLocalStorage()

    }
    saveToLocalStorage() {
        // Convert task objects to plain objects to avoid circular references
        localStorage.setItem('tasks', JSON.stringify(this.todos));
        };

     loadFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        
        if (storedTasks && storedTasks !== 'undefined') {
            const taskData = JSON.parse(storedTasks) || [];
            this.todos = taskData.map(data => 
                Object.assign(new Todo(data.title, data.description, data.priority, data.dueDate), data)
            );
        }
    }
        
    
        // Clear all tasks from localStorage
        clearLocalStorage() {
            localStorage.removeItem('tasks');
            this.todos = [];
        }

    }

//random comment



export {taskManager}