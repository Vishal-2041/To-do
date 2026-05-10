const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const dateDisplay = document.getElementById('current-date');
const viewTitle = document.getElementById('view-title');
const navItems = document.querySelectorAll('.nav-item');

let currentView = 'myday';
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

// Sidebar Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.nav-item.active').classList.remove('active');
        item.classList.add('active');
        
        currentView = item.getAttribute('data-view');
        viewTitle.innerText = item.innerText.replace(/[^\w\s]/gi, '').trim();
        renderTasks();
    });
});

// Set Date
const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
dateDisplay.innerText = new Date().toLocaleDateString(undefined, dateOptions);

// Add Task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && taskInput.value.trim() !== "") {
        const newTask = {
            id: Date.now(),
            text: taskInput.value,
            completed: false,
            important: currentView === 'important',
            date: new Date().toISOString()
        };
        tasks.unshift(newTask);
        saveAndRender();
        taskInput.value = "";
    }
});

function saveAndRender() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";
    
    let filtered = tasks;
    if (currentView === 'important') filtered = tasks.filter(t => t.important);
    else if (currentView === 'planned') filtered = tasks.filter(t => !t.completed);
    else if (currentView === 'myday') filtered = tasks.filter(t => !t.completed);

    filtered.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <div class="circle-check"></div>
            <span>${task.text}</span>
            <div class="task-actions">
                <span class="star-icon ${task.important ? 'active' : ''}">★</span>
                <button class="delete-btn">✕</button>
            </div>
        `;

        div.querySelector('.circle-check').addEventListener('click', () => {
            task.completed = !task.completed;
            saveAndRender();
        });

        div.querySelector('.star-icon').addEventListener('click', () => {
            task.important = !task.important;
            saveAndRender();
        });

        div.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        });

        taskList.appendChild(div);
    });
}

renderTasks();
