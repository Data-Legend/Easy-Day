
export let state = {
    todayDate: {},
    toDoList: [],
    booksList: [],
    archive: [],
};

// ==============Helpers====================
const done = function () {
    const audio = new Audio('./src/audio/done.mp3');
    audio.play().catch(() => { }); // Silently fail if audio can't play
};

// =========================================
export const addTask = function (input, priority) {
    const thisDay = new Date().toString().split(" ").splice(1, 3).join(" ");
    const task = {
        id: generateId(),
        task: input,
        priority: priority,
        done: false,
        due: 'Today',
        added: thisDay,
    };
    state.toDoList.push(task);
    rearrangeTasks();
    saveData();
};

const generateId = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const rearrangeTasks = function () {
    if (state.toDoList.length < 2) return;
    const highTasks = state.toDoList.filter(el => el.priority === 'HIGH');
    const midTasks = state.toDoList.filter(el => el.priority === 'MID');
    const easyTasks = state.toDoList.filter(el => el.priority === 'Easy');
    state.toDoList = [...highTasks, ...midTasks, ...easyTasks];
};

export const taskDone = function (name) {
    const taskIndex = state.toDoList.findIndex(el => el.task === name);
    if (taskIndex === -1) return;
    const check = state.toDoList[taskIndex].done;
    if (!check) {
        state.toDoList[taskIndex].done = true;
        done();
    } else {
        state.toDoList[taskIndex].done = false;
    }
    saveData();
};

export const editTask = function (oldName, newName) {
    const taskIndex = state.toDoList.findIndex(el => el.task === oldName);
    if (taskIndex === -1) return;
    state.toDoList[taskIndex].task = newName;
    saveData();
};

const getDate = function () {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayObj = new Date();
    const dateForm = todayObj.toString().split(" ").splice(1, 3).map((val, i) => i === 1 ? `${val},` : val).join(" ");
    const today = days[todayObj.getDay()];
    state.todayDate = { dayName: today, date: dateForm, dayObj: todayObj };
};

const dailyTasksUpdate = function () {
    if (!state || !state.toDoList) return;
    const rightNow = new Date().toString().split(" ").splice(1, 3).join(" ");
    state.toDoList.forEach(task => {
        if (task.added !== rightNow) {
            task.done = false;
            task.added = rightNow;
        }
    });
    saveData();
};

export const archiveTask = function (tName) {
    const index = state.toDoList.findIndex(t => t.task === tName);
    if (index === -1) return;
    state.archive.push(state.toDoList[index]);
    state.toDoList.splice(index, 1);
    saveData();
};

// ============= Books ======================
export const addBook = function (book) {
    const thisDay = new Date().toString().split(" ").splice(1, 3).join(" ");
    const bookObj = {
        id: generateId(),
        book: book,
        added: thisDay,
        read: false,
    };
    state.booksList.push(bookObj);
    saveData();
};

export const removeBook = function (book) {
    const index = state.booksList.findIndex(b => b.book === book);
    if (index === -1) return;
    state.archive.push(state.booksList[index]);
    state.booksList.splice(index, 1);
    saveData();
};

export const IsBookRead = function (book) {
    const bookIndex = state.booksList.findIndex(el => el.book === book);
    if (bookIndex === -1) return;
    const check = state.booksList[bookIndex].read;
    if (!check) {
        state.booksList[bookIndex].read = true;
        done();
    } else {
        state.booksList[bookIndex].read = false;
    }
    saveData();
};

// ============= Archive ====================
export const saveData = function () {
    localStorage.setItem('state', JSON.stringify(state));
};

const getData = function () {
    const data = localStorage.getItem('state');
    if (!data) return;
    state = JSON.parse(data);
    // Migrate: remove moviesList if it exists from old data
    if (state.moviesList) {
        // Move movies to archive before deleting
        state.moviesList.forEach(m => {
            if (m) state.archive.push(m);
        });
        delete state.moviesList;
        saveData();
    }
    // Ensure all required fields exist
    if (!state.toDoList) state.toDoList = [];
    if (!state.booksList) state.booksList = [];
    if (!state.archive) state.archive = [];
};

export const deleteItem = function (item) {
    const itemIndex = state.archive.findIndex(el => {
        if (!el) return false;
        return el[Object.keys(el)[0]] === item;
    });
    if (itemIndex === -1) return;
    state.archive.splice(itemIndex, 1);
    saveData();
};

// ============= Export/Import ==============
export const exportData = function () {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `easy-day-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const importData = function (jsonString) {
    try {
        const data = JSON.parse(jsonString);
        if (!data.toDoList || !data.booksList || !data.archive) {
            throw new Error('Invalid data format');
        }
        state.toDoList = data.toDoList;
        state.booksList = data.booksList;
        state.archive = data.archive;
        saveData();
        return true;
    } catch (e) {
        console.error('Import failed:', e);
        return false;
    }
};

// ============= Theme =====================
export const getTheme = function () {
    return localStorage.getItem('theme') || 'dark';
};

export const setTheme = function (theme) {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
};

const init = function () {
    getData();
    getDate();
    dailyTasksUpdate();
    // Apply saved theme
    const savedTheme = getTheme();
    document.body.setAttribute('data-theme', savedTheme);
};
init();