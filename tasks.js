function renderFilteredTasks() {
    const taskContainer = document.getElementById("task-container");
    if (!taskContainer) {
        console.error("task-container element not found");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const department = params.get("department");
    console.log("Filtered for Department:", department); // Debugging
    const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
// ...existing code...
    const filteredTasks = allTasks.filter(
    task => task.department.toLowerCase() === (department || "").toLowerCase()
);
// filepath: c:\Users\HP\Desktop\Task_Management_System\tasks.js
    // const filteredTasks = allTasks.filter(task => task.department === department);

    taskContainer.innerHTML = ""; // Clear container

    if (filteredTasks.length === 0) {
        taskContainer.innerHTML = `<p class="text-center text-gray-600">No tasks available for the selected department.</p>`;
        return;
    }

    const table = document.createElement("table");
    table.className = "w-full border-collapse border border-gray-300 bg-white";
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
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    filteredTasks.forEach((task) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="border border-gray-300 px-4 py-2">${task.title}</td>
            <td class="border border-gray-300 px-4 py-2">${task.description}</td>
            <td class="border border-gray-300 px-4 py-2">${task.dueDate}</td>
            <td class="border border-gray-300 px-4 py-2">${task.priority}</td>
            <td class="border border-gray-300 px-4 py-2">${task.project}</td>
            <td class="border border-gray-300 px-4 py-2">${task.department}</td>
            <td class="border border-gray-300 px-4 py-2">${task.assignee}</td>
            
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    taskContainer.appendChild(table);

    

    
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event triggered");
    renderFilteredTasks();
    window.addEventListener("popstate", ()=>{
        console.log("URL changed via browser navigation, re-rendering filtered tasks...");
        renderFilteredTasks();
    })
});

function updateURL(department){
    const newurl=`${window.location.pathname}?department=${department}`;
    history.pushState({},'', newurl);
    window.dispatchEvent(new Event('popstate')); // Trigger renderFilteredTasks

} 
