// Initialize task array from localStorage or as an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// DOM elements
const form = document.getElementById("task-form"); 
const taskListSection = document.getElementById("task-list");
const dropdownBtn = document.getElementById("department-dropdown-btn");
const dropdownMenu = document.getElementById("department-dropdown");
const taskContainer = document.getElementById("task-container");

// Toggle dropdown menu visibility
dropdownBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
});

// Filter tasks based on department
dropdownMenu.addEventListener("click", (event) => {
    if(event.target && event.target.tagName === "LI") {
        const selectedDepartment = event.target.getAttribute("data-department");
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const filteredTasks = storedTasks.filter(task => 
            task.department.toLowerCase() === selectedDepartment.toLowerCase());

        if (filteredTasks.length === 0) {
            taskContainer.innerHTML = "No tasks for this department.";
        } else {
            taskContainer.innerHTML = "";
            filteredTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                taskContainer.appendChild(taskElement);
            });
        }

        dropdownMenu.classList.add("hidden");
    }
});

// Save tasks to local storage
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Create task element
function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.className = "task-item";
    taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <ul>
            <li>Due Date: ${task.dueDate}</li>
            <li>Priority: ${task.priority}</li>
            <li>Project: ${task.project}</li>
            <li>Department: ${task.department}</li>
            <li>Assigned To: ${task.assignee}</li>
        </ul>
        <button onclick="editTask(${task.taskId})">Edit</button>
        <button class="delete-btn" data-id="${task.taskId}">Delete</button>
    `;
    return taskElement;
}

// Render tasks
function renderTasks() {
    taskContainer.innerHTML = ""; // Clear the container

    if (tasks.length === 0) {
        taskContainer.innerHTML = `<p class="text-center text-gray-600">No tasks available.</p>`;
        return;
    }

    // Create table
    const table = document.createElement("table");
    table.className = "w-full border-collapse border border-gray-300 bg-white ";

    // Create table header
    const thead = document.createElement("thead");
    thead.className = "bg-gray-200";
    thead.innerHTML = `
        <tr>
            <th class="border border-gray-300 px-4 py-2 text-left">Title</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Description</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Due Date</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Priority</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Project</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Department</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Assignee</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Actions</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    tasks.forEach((task) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="border border-gray-300 px-4 py-2">${task.title}</td>
            <td class="border border-gray-300 px-4 py-2">${task.description}</td>
            <td class="border border-gray-300 px-4 py-2">${task.dueDate}</td>
            <td class="border border-gray-300 px-4 py-2">${task.priority}</td>
            <td class="border border-gray-300 px-4 py-2">${task.project}</td>
            <td class="border border-gray-300 px-4 py-2">${task.department}</td>
            <td class="border border-gray-300 px-4 py-2">${task.assignee}</td>
            <td class="border border-gray-300 px-4 py-2">
                <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded-md mr-2" data-id="${task.taskId}">Edit</button>
                <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded-md" data-id="${task.taskId}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    taskContainer.appendChild(table);

    // Add event listeners for actions
    document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = parseInt(event.target.getAttribute("data-id"));
            editTask(taskId);
        });
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = parseInt(event.target.getAttribute("data-id"));
            deleteTask(taskId);
        });
    });
}


// Handle form submission (new task)
function handleFormSubmit(event) {
    event.preventDefault();

    const task = {
        taskId: Date.now(),
        title: document.getElementById("task-title").value.trim(),
        description: document.getElementById("task-desc").value.trim(),
        dueDate: document.getElementById("due-date").value,
        priority: document.getElementById("priority").value,
        project: document.getElementById("project").value,
        department: document.getElementById("task-department").value,
        assignee: document.getElementById("assignee").value.trim(),
    };

    if (
        !task.title ||
        !task.description ||
        !task.dueDate ||
        !task.priority ||
        !task.project ||
        !task.department ||
        !task.assignee
    ) {
        alert("Please fill in all fields");
        return;
    }
    tasks.push(task);
    saveTasksToLocalStorage(); 
    renderTasks();
    form.reset();
}

// Global variable to track which task is being edited
let currentlyEditingTaskId = null;

function editTask(taskId) {
    const taskIndex = tasks.findIndex((task) => task.taskId === Number(taskId));
    if (taskIndex === -1) {
        console.error(`Task with ID ${taskId} not found.`);
        return;
    }
    
    // Store the taskId we're currently editing
    currentlyEditingTaskId = taskId;
    
    const task = tasks[taskIndex];
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.description;
    document.getElementById("due-date").value = task.dueDate;
    document.getElementById("priority").value = task.priority;
    document.getElementById("project").value = task.project;
    document.getElementById("task-department").value = task.department;
    document.getElementById("assignee").value = task.assignee;
    
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.innerText = "Update Task";

    // Change the form submission handler
    form.removeEventListener("submit", handleFormSubmit);
    form.addEventListener("submit", handleUpdateSubmit);
    
    // Scroll to the form
    form.scrollIntoView({ behavior: 'smooth' });
}

// Separate function to handle update submissions
function handleUpdateSubmit(event) {
    event.preventDefault();
    
    if (currentlyEditingTaskId === null) {
        console.error("No task is currently being edited");
        return;
    }
    
    const taskIndex = tasks.findIndex((task) => task.taskId === Number(currentlyEditingTaskId));
    if (taskIndex === -1) {
        console.error(`Task with ID ${currentlyEditingTaskId} not found.`);
        return;
    }
    
    // Create the updated task object
    const updatedTask = {
        taskId: Number(currentlyEditingTaskId), // Keep the same ID
        title: document.getElementById("task-title").value.trim(),
        description: document.getElementById("task-desc").value.trim(),
        dueDate: document.getElementById("due-date").value,
        priority: document.getElementById("priority").value,
        project: document.getElementById("project").value,
        department: document.getElementById("task-department").value,
        assignee: document.getElementById("assignee").value.trim(),
    };
    
    // Validate all fields are filled
    if (
        !updatedTask.title ||
        !updatedTask.description ||
        !updatedTask.dueDate ||
        !updatedTask.priority ||
        !updatedTask.project ||
        !updatedTask.department ||
        !updatedTask.assignee
    ) {
        alert("Please fill in all fields");
        return;
    }
    
    // Update the task
    tasks[taskIndex] = updatedTask;
    
    // Save and render
    saveTasksToLocalStorage();
    renderTasks();
    
    // Reset the form and update handling
    form.reset();
    currentlyEditingTaskId = null;
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.innerText = "Add Task";
    
    // Remove the update handler and restore the original handler
    form.removeEventListener("submit", handleUpdateSubmit);
    form.addEventListener("submit", handleFormSubmit);
}

function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    
    // If the user clicks "Cancel", exit the function
    if (!confirmDelete) {
        return;
    }
    const taskIndex = tasks.findIndex((task) => task.taskId === Number(taskId));
    if (taskIndex === -1) {
        return;
    }

    tasks.splice(taskIndex, 1);
    saveTasksToLocalStorage();
    renderTasks();
}

// Initial setup
form.addEventListener("submit", handleFormSubmit);
renderTasks();

document.getElementById("submit-btn").addEventListener("click", function(event) {
    if (this.innerText === "Add Task" && currentlyEditingTaskId !== null) {
        // If we were in edit mode but clicked Add Task, reset everything
        currentlyEditingTaskId = null;
        form.reset();
        form.removeEventListener("submit", handleUpdateSubmit);
        form.addEventListener("submit", handleFormSubmit);
    }
});

