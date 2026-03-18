import * as model from './model.js';
import dateView from './view/dateView.js';
import tasksView from './view/tasksView.js';
import menuView from './view/menuView.js';
import archiveView from './view/archiveView.js';
import booksView from './view/booksView.js';

// ===================== Toast System =====================
const showToast = function (message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('exit');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

// ===================== Daily Tasks =====================
const controlDate = function () {
    dateView.render(model.state.todayDate);
};

const controlTasksList = function () {
    tasksView.render(model.state.toDoList);
};

const controlAddTask = function (input, priority) {
    model.addTask(input, priority);
    tasksView.render(model.state.toDoList);
    showToast('Task added!', 'success');
};

const controlTaskDone = function (tName) {
    model.taskDone(tName);
    tasksView.render(model.state.toDoList);
};

const controlTaskArchive = function (tName) {
    model.archiveTask(tName);
    tasksView.render(model.state.toDoList);
    showToast('Task archived', 'info');
};

const controlEditTask = function (oldName, newName) {
    model.editTask(oldName, newName);
    tasksView.render(model.state.toDoList);
    showToast('Task updated', 'success');
};

const initDailyTasks = function () {
    controlDate();
    controlTasksList();
    // Show search and stats
    showSearchAndStats(true);
    tasksView.addTaskHandler(controlAddTask);
    tasksView.addTaskDoneHandler(controlTaskDone);
    tasksView.removeTaskDoneHandler(controlTaskArchive);
    tasksView.addEditHandler(controlEditTask);
    tasksView.addSearchHandler(controlTasksList);
    tasksView.addFilterHandler(controlTasksList);
};

const showSearchAndStats = function (show) {
    const searchBar = document.getElementById('searchBar');
    const statsBar = document.getElementById('statsBar');
    const addForm = document.querySelector('.add-form');
    const header = document.querySelector('.header');
    if (searchBar) searchBar.style.display = show ? '' : 'none';
    if (statsBar) statsBar.style.display = show ? '' : 'none';
    if (addForm) addForm.style.display = show ? '' : 'none';
    if (header) header.style.display = show ? '' : 'none';
};

// ===================== Menu =====================
const controlMenu = function () {
    menuView.render(true);
};

// ===================== Books =====================
const controlAddBook = function (book) {
    model.addBook(book);
    booksListReactivate();
    showToast('Book added!', 'success');
};

const controlRemoveBook = function (book) {
    model.removeBook(book);
    booksListReactivate();
    showToast('Book archived', 'info');
};

const controlIsBookRead = function (book) {
    model.IsBookRead(book);
    booksListReactivate();
};

const booksListReactivate = function () {
    booksView.render(model.state.booksList);
    booksView.addbookHandler(controlAddBook);
    booksView.removebookHandler(controlRemoveBook);
    booksView.bookRead(controlIsBookRead);
};

// ===================== Archive =====================
const controlClearArchive = function () {
    model.state.archive = [];
    model.saveData();
    archiveReactivate();
    showToast('Archive cleared', 'danger');
};

const controlDeleteItem = function (item) {
    model.deleteItem(item);
    archiveReactivate();
    showToast('Item deleted', 'danger');
};

const archiveReactivate = function () {
    archiveView.render(model.state.archive);
    archiveView.clearArchiveHandler(controlClearArchive);
    archiveView.removeItem(controlDeleteItem);
};

// ===================== Navigation =====================
let currentSection = 'dailyTasks';

const menuClickHandler = function (id) {
    currentSection = id;

    // Reset container for non-task views
    const container = document.getElementById('appContainer');

    if (id === 'dailyTasks') {
        // Restore the full daily tasks view
        container.innerHTML = `
            <header class="header" id="dateHeader">
                <div><img src="./src/imgs/Calendar-icon.png" alt="Calendar"><h1></h1></div>
                <p></p>
            </header>
            <div class="search-bar" id="searchBar">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Search tasks...">
                <button class="search-clear" id="searchClear"><i class="fas fa-times"></i></button>
            </div>
            <div class="add-form">
                <form class="new-task-form" id="taskForm" action="">
                    <div class="select-wrapper">
                        <select id="priority">
                            <option selected value="Easy">EASY</option>
                            <option value="MID">MID</option>
                            <option value="HIGH">HIGH</option>
                        </select>
                    </div>
                    <input autofocus id="taskInput" type="text" name="newTask" placeholder="Add a new task..." maxlength="120">
                    <button type="submit" id="addTaskBtn"><i class="fas fa-plus"></i> Add</button>
                </form>
            </div>
            <div class="stats-bar" id="statsBar">
                <div class="stats-item">
                    <span class="stats-label">Total</span>
                    <span class="stats-value" id="statTotal">0</span>
                </div>
                <div class="stats-item">
                    <span class="stats-label">Done</span>
                    <span class="stats-value stats-done" id="statDone">0</span>
                </div>
                <div class="stats-item">
                    <span class="stats-label">Remaining</span>
                    <span class="stats-value stats-remaining" id="statRemaining">0</span>
                </div>
                <div class="stats-progress">
                    <div class="stats-progress-bar" id="statsProgressBar"></div>
                </div>
            </div>
            <section class="tasks" id="tasksSection">
                <div class="tasks-list"><ul class="today-s-list"></ul></div>
            </section>
        `;
        // Re-bind DOM references
        tasksView._parentEl = document.querySelector('#tasksSection');
        tasksView._form = document.querySelector('#taskForm');
        tasksView._searchInput = document.querySelector('#searchInput');
        tasksView._searchClear = document.querySelector('#searchClear');
        tasksView._statsBar = document.querySelector('#statsBar');
        tasksView.clearSearch();
        initDailyTasks();
    }

    if (id === 'archive') {
        showSearchAndStats(false);
        archiveReactivate();
    }

    if (id === 'booksList') {
        showSearchAndStats(false);
        booksListReactivate();
    }
};

// ===================== Theme Toggle =====================
const initTheme = function () {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Set initial icon
    updateThemeIcon();

    themeToggle.addEventListener('click', function () {
        const currentTheme = model.getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        model.setTheme(newTheme);
        updateThemeIcon();
        showToast(`Switched to ${newTheme} mode`, 'info');
    });
};

const updateThemeIcon = function () {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const theme = model.getTheme();
    themeToggle.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
};

// ===================== Export/Import =====================
const initExportImport = function () {
    const exportBtn = document.getElementById('exportBtn');
    const importInput = document.getElementById('importInput');

    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            model.exportData();
            showToast('Data exported!', 'success');
        });
    }

    if (importInput) {
        importInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (event) {
                const success = model.importData(event.target.result);
                if (success) {
                    showToast('Data imported successfully!', 'success');
                    // Reload current view
                    menuClickHandler(currentSection);
                } else {
                    showToast('Import failed — invalid file format', 'danger');
                }
            };
            reader.readAsText(file);
            // Reset input so same file can be re-imported
            e.target.value = '';
        });
    }
};

// ===================== Keyboard Shortcuts =====================
const initKeyboardShortcuts = function () {
    const modal = document.getElementById('shortcutsModal');
    const closeBtn = document.getElementById('closeShortcuts');

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    document.addEventListener('keydown', function (e) {
        // Don't trigger if typing in input
        const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

        if (e.key === 'Escape') {
            // Close modal
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                return;
            }
            // Clear search
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                tasksView._filterQuery = '';
                controlTasksList();
                return;
            }
            // Blur active element
            document.activeElement.blur();
            return;
        }

        if (isTyping) return;

        // N — Focus new task input
        if (e.key === 'n' || e.key === 'N') {
            e.preventDefault();
            const taskInput = document.getElementById('taskInput');
            if (taskInput) taskInput.focus();
        }

        // S — Focus search
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        }

        // 1, 2, 3 — Navigate sections
        if (e.key === '1') {
            const li = document.getElementById('dailyTasks');
            if (li) li.click();
        }
        if (e.key === '2') {
            const li = document.getElementById('booksList');
            if (li) li.click();
        }
        if (e.key === '3') {
            const li = document.getElementById('archive');
            if (li) li.click();
        }

        // T — Toggle theme
        if (e.key === 't' || e.key === 'T') {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) themeToggle.click();
        }

        // ? — Show shortcuts
        if (e.key === '?') {
            if (modal) modal.classList.add('active');
        }
    });
};

// ===================== Init =====================
const init = function () {
    initDailyTasks();
    controlMenu();
    menuView.menuHandler(menuClickHandler);
    initTheme();
    initExportImport();
    initKeyboardShortcuts();
};

init();
