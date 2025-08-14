// ===== VARIÁVEIS =====
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
let currentFilter = "all";

// ===== CARREGA TAREFAS SALVAS =====
document.addEventListener("DOMContentLoaded", loadTasks);

// ===== ADICIONA NOVA TAREFA =====
function addTask() {
    const taskText = taskInput.value.trim();
    if(taskText === "") return;

    createTaskElement(taskText);
    saveTask(taskText);
    taskInput.value = "";
}

// ===== CRIA ELEMENTO DE TAREFA =====
function createTaskElement(taskText, completed = false) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${taskText}</span>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>`;

    if(completed) li.classList.add("completed");

    li.addEventListener("click", (e) => {
        if(e.target.closest(".delete-btn")) return;
        li.classList.toggle("completed");
        updateTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        updateTasks();
    });

    taskList.appendChild(li);
    applyFilter();
}

// ===== SALVA NO LOCALSTORAGE =====
function saveTask(taskText) {
    const tasks = getSavedTasks();
    tasks.push({text: taskText, completed: false});
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== RETORNA TAREFAS SALVAS =====
function getSavedTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

// ===== CARREGA TAREFAS =====
function loadTasks() {
    const tasks = getSavedTasks();
    tasks.forEach(task => createTaskElement(task.text, task.completed));
}

// ===== ATUALIZA LOCALSTORAGE =====
function updateTasks() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    applyFilter();
}

// ===== FILTRA TAREFAS =====
function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
    applyFilter();
}

// ===== APLICA FILTRO VISUAL =====
function applyFilter() {
    document.querySelectorAll("#taskList li").forEach(li => {
        li.style.display = "flex";
        if(currentFilter === "pending" && li.classList.contains("completed")) li.style.display = "none";
        else if(currentFilter === "completed" && !li.classList.contains("completed")) li.style.display = "none";
    });
}
