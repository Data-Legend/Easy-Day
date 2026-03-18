(function () {
  'use strict';
  // ============================================================
  //  Easy-Day — Complete SPA v3
  //  Features: tasks, books, archive, categories, page tracking,
  //  priority colors, daily/repeat, search, export/import, themes
  // ============================================================

  // ─── State ─────────────────────────────────────────────────
  var state = {
    todayDate: {},
    toDoList: [],
    booksList: [],
    archive: [],
  };

  var currentView = 'tasks';
  var searchQuery = '';
  var priorityFilter = 'ALL';
  var taskCatFilter = 'ALL';
  var bookCatFilter = 'ALL';
  var taskOptionsOpen = false;
  var bookOptionsOpen = false;

  // ─── Helpers ───────────────────────────────────────────────
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var esc = function (str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  };

  var uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };

  var titleCase = function (s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); };

  var i18n = {
    en: {
      tasks: 'Tasks', books: 'Books', archive: 'Archive', theme: 'Toggle theme', export: 'Export', import: 'Import', shortcuts: 'Shortcuts',
      total: 'Total', done: 'Done', left: 'Left',
      easy: 'EASY', mid: 'MID', high: 'HIGH', all: 'All', main: 'Main', general: 'General',
      taskPlaceholder: 'What needs to be done?', due: 'Due', category: 'Category', daily: 'Daily', repeat: 'Repeat',
      noMatch: 'No matching tasks', adjFilters: 'Try adjusting your filters', noTasks: 'No tasks yet', addFirst: 'Add your first task above!',
      upcoming: 'Upcoming', Remove: 'Remove',
      readList: 'Reading List', book: 'book', read: 'read', pgRead: 'Pages Read',
      addBook: 'Add a new book...', totalPg: 'Total Pages', dailyGl: 'Daily Goal', catEx: 'Category (e.g. Science)', author: 'Author', authorEx: 'Author (e.g. Orwell)',
      noCatBooks: 'No books in this category', tryCat: 'Try another category', noBooks: 'No books yet', startRead: 'Start building your reading list!',
      expected: 'EXPECTED: ', added: 'Added: ', finished: 'Finished: ', pg: 'pg', pgDay: 'pg/day',
      archEmpty: 'Archive is empty', archSub: 'Archived tasks and books will appear here.', clrArch: 'Clear archive',
      restored: 'Restored!', deleted: 'Deleted', archCleared: 'Archive cleared',
      taskAdded: 'Task added!', taskUpd: 'Task updated', taskArch: 'Task archived', bookAdded: 'Book added!', bookArch: 'Book archived', changesSaved: 'Changes saved',
      dataExp: 'Data exported!', dataImp: 'Data imported!', impFail: 'Import failed',
      editTitle: 'Edit Details', saveChanges: 'Save Changes',
      today: 'Today', overdue: 'Overdue',
      newTask: 'New task', search: 'Search', help: 'This help', closeClear: 'Close / Clear', langName: 'العربية'
    },
    ar: {
      tasks: 'المهام', books: 'الكتب', archive: 'الأرشيف', theme: 'تبديل المظهر', export: 'تصدير', import: 'استيراد', shortcuts: 'الاختصارات',
      total: 'الإجمالي', done: 'مكتمل', left: 'متبقي',
      easy: 'سهل', mid: 'متوسط', high: 'عالي', all: 'الكل', main: 'رئيسي', general: 'عام',
      taskPlaceholder: 'ما الذي ينبغي إنجازه اليوم؟', due: 'الاستحقاق', category: 'الفئة', daily: 'يومياً', repeat: 'التكرار',
      noMatch: 'لا توجد مهام مطابقة', adjFilters: 'حاول تغيير الفلاتر', noTasks: 'لا توجد مهام بعد', addFirst: 'أضف مهمتك الأولى بالأعلى!',
      upcoming: 'القادمة', Remove: 'حذف',
      readList: 'قائمة القراءة', book: 'كتاب', read: 'تمت قرائته', pgRead: 'الصفحات المقروءة',
      addBook: 'أضف كتاباً جديداً...', totalPg: 'عدد الصفحات', dailyGl: 'الهدف اليومي', catEx: 'الفئة (مثال: علوم)', author: 'المؤلف', authorEx: 'المؤلف (مثال: العقاد)',
      noCatBooks: 'لا توجد كتب في هذه الفئة', tryCat: 'جرب فئة مختلفة', noBooks: 'لا توجد كتب في القائمة', startRead: 'ابدأ ببناء قائمة قراءتك!',
      expected: 'المتوقع: ', added: 'أُضيف: ', finished: 'اكتمل: ', pg: 'ص', pgDay: 'ص/ي',
      archEmpty: 'الأرشيف فارغ', archSub: 'المهام والكتب المؤرشفة ستظهر هنا.', clrArch: 'تفريغ الأرشيف',
      restored: 'تمت الاستعادة!', deleted: 'تم الحذف', archCleared: 'تم تفريغ الأرشيف',
      taskAdded: 'تمت إضافة المهمة!', taskUpd: 'تم تحديث المهمة!', taskArch: 'تم أرشفة المهمة', bookAdded: 'تم إضافة الكتاب!', bookArch: 'تمت أرشفة الكتاب', changesSaved: 'تم حفظ التغييرات',
      dataExp: 'تم تصدير البيانات!', dataImp: 'تم استيراد البيانات!', impFail: 'فشل الاستيراد',
      editTitle: 'تعديل التفاصيل', saveChanges: 'حفظ التغييرات',
      today: 'اليوم', overdue: 'متأخر',
      newTask: 'مهمة جديدة', search: 'بحث', help: 'تعليمات', closeClear: 'إغلاق', langName: 'English'
    }
  };

  var t = function (key) {
    var l = state.lang || 'en';
    return i18n[l][key] || key;
  };

  var DAYS_FULL = { en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] };
  var DAYS_SHORT = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ar: ['أح', 'إث', 'ث', 'أر', 'خ', 'ج', 'س'] };
  var MONTHS = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] };

  // ─── Azkar Integration ──────────────────────────────────────
  var AZKAR = [];
  var currentZikr = { text: 'جاري التحميل...', category: 'general' };

  var loadAzkar = function () {
    fetch('./src/data/azkar.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        AZKAR = data;
        pickZikr();
        render();
      })
      .catch(function (e) {
        console.error('Error loading azkar', e);
        currentZikr = { text: 'تعذر تحميل الأذكار، يرجى تشغيل التطبيق عبر خادم محلي (Local Server).', category: 'general' };
        render();
      });
  };

  var pickZikr = function () {
    if (!AZKAR || AZKAR.length === 0) return;
    var hour = new Date().getHours();
    var isMorning = hour >= 4 && hour < 12; // 4 AM to 12 PM
    var targetCat = isMorning ? 'morning' : 'evening';

    var valid = AZKAR.filter(function (z) {
      return z.category === targetCat || z.category === 'general';
    });

    if (valid.length === 0) valid = AZKAR;
    currentZikr = valid[Math.floor(Math.random() * valid.length)];
  };

  // ─── Category Colors ────────────────────────────────────────
  var CAT_COLORS = [
    { bg: 'rgba(91,123,250,0.15)', fg: '#5b7bfa' },  // blue
    { bg: 'rgba(167,139,250,0.15)', fg: '#a78bfa' },  // purple
    { bg: 'rgba(236,72,153,0.15)', fg: '#ec4899' },  // pink
    { bg: 'rgba(245,166,35,0.15)', fg: '#f5a623' },  // amber
    { bg: 'rgba(34,211,238,0.15)', fg: '#22d3ee' },  // cyan
    { bg: 'rgba(61,214,140,0.15)', fg: '#3dd68c' },  // green
    { bg: 'rgba(251,146,60,0.15)', fg: '#fb923c' },  // orange
    { bg: 'rgba(244,63,94,0.15)', fg: '#f43f5e' },  // rose
    { bg: 'rgba(56,189,248,0.15)', fg: '#38bdf8' },  // sky
    { bg: 'rgba(132,204,22,0.15)', fg: '#84cc16' },  // lime
  ];

  var catColorIndex = function (name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
    return Math.abs(hash) % CAT_COLORS.length;
  };

  var catColor = function (name) {
    return CAT_COLORS[catColorIndex(name || 'Main')];
  };

  // ─── Sounds ────────────────────────────────────────────────
  var playDone = function () {
    try { new Audio('./src/audio/done.mp3').play().catch(function () { }); } catch (_) { }
  };

  var playDelete = function () {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
    } catch (_) { }
  };

  // ─── Date helpers ──────────────────────────────────────────
  var todayStr = function () {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  var formatDate = function (iso) {
    if (!iso) return '';
    var p = iso.split('-');
    if (p.length !== 3) return iso;
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    var l = state.lang || 'en';
    return l === 'ar' ? d.getDate() + ' ' + MONTHS[l][d.getMonth()] : MONTHS[l][d.getMonth()] + ' ' + d.getDate();
  };

  var isToday = function (iso) { return iso === todayStr(); };
  var isPast = function (iso) { return iso && iso < todayStr(); };

  // ─── Persistence ───────────────────────────────────────────
  var save = function () { localStorage.setItem('easyDayState', JSON.stringify(state)); };

  var load = function () {
    try {
      var raw = localStorage.getItem('easyDayState');
      if (!raw) return;
      var d = JSON.parse(raw);
      state.toDoList = Array.isArray(d.toDoList) ? d.toDoList : [];
      state.booksList = Array.isArray(d.booksList) ? d.booksList : [];
      state.archive = Array.isArray(d.archive) ? d.archive : [];
      state.lang = d.lang || 'en';
      if (Array.isArray(d.moviesList)) {
        d.moviesList.forEach(function (m) { if (m) state.archive.push(m); });
        save();
      }
      // Migrate: ensure category field exists
      state.toDoList.forEach(function (t) { if (!t.category) t.category = 'Main'; });
      state.booksList.forEach(function (b) {
        if (!b.category) b.category = 'General';
        if (!b.author) b.author = '';
        if (b.totalPages === undefined) b.totalPages = 0;
        if (b.pagesRead === undefined) b.pagesRead = 0;
        if (b.dailyGoal === undefined) b.dailyGoal = 0;
      });
    } catch (_) { }
  };

  var getTheme = function () { return localStorage.getItem('easyDayTheme') || 'dark'; };
  var setTheme = function (t) { localStorage.setItem('easyDayTheme', t); document.body.dataset.theme = t; };

  // ─── Date init ─────────────────────────────────────────────
  var initDate = function () {
    var l = state.lang || 'en';
    var now = new Date();
    var dateForm = l === 'ar'
      ? now.getDate() + ' ' + MONTHS[l][now.getMonth()] + ' ' + now.getFullYear()
      : MONTHS[l][now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
    state.todayDate = { dayName: DAYS_FULL[l][now.getDay()], date: dateForm };
  };

  // ─── Daily reset ───────────────────────────────────────────
  var dailyReset = function () {
    var today = todayStr();
    var todayDow = new Date().getDay();
    state.toDoList.forEach(function (t) {
      if (!t.lastReset) t.lastReset = '';
      if (t.lastReset === today) return;
      if (t.daily) { t.done = false; t.lastReset = today; }
      else if (t.repeatDays && t.repeatDays.length > 0) {
        if (t.repeatDays.indexOf(todayDow) !== -1) { t.done = false; t.lastReset = today; }
      }
    });
    save();
  };

  // ─── CRUD: Tasks ───────────────────────────────────────────
  var addTask = function (text, prio, opts) {
    opts = opts || {};
    state.toDoList.push({
      id: uid(), task: text, priority: prio, done: false,
      dueDate: opts.dueDate || todayStr(),
      daily: !!opts.daily,
      repeatDays: opts.repeatDays || [],
      category: opts.category || 'Main',
      added: todayStr(), lastReset: todayStr(),
    });
    sortTasks(); save();
  };

  var sortTasks = function () {
    var prioOrder = { HIGH: 0, MID: 1, Easy: 2 };
    state.toDoList.sort(function (a, b) {
      if (a.done !== b.done) return a.done ? 1 : -1;
      var pa = prioOrder[a.priority] !== undefined ? prioOrder[a.priority] : 1;
      var pb = prioOrder[b.priority] !== undefined ? prioOrder[b.priority] : 1;
      if (pa !== pb) return pa - pb;
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    });
  };

  var toggleTask = function (id) {
    var t = state.toDoList.find(function (x) { return x.id === id; });
    if (!t) return;
    t.done = !t.done;
    if (t.done) playDone();
    sortTasks(); save();
  };

  var editTask = function (id, newText) {
    var t = state.toDoList.find(function (x) { return x.id === id; });
    if (t) { t.task = newText; save(); }
  };

  var archiveTask = function (id) {
    var i = state.toDoList.findIndex(function (x) { return x.id === id; });
    if (i === -1) return;
    playDelete();
    state.archive.push(state.toDoList[i]);
    state.toDoList.splice(i, 1);
    save();
  };

  var getTaskCategories = function () {
    var cats = {};
    state.toDoList.forEach(function (t) { cats[t.category || 'Main'] = true; });
    return Object.keys(cats).sort();
  };

  // ─── CRUD: Books ───────────────────────────────────────────
  var addBook = function (text, opts) {
    opts = opts || {};
    state.booksList.push({
      id: uid(), book: text, added: todayStr(), read: false,
      category: opts.category || 'General',
      author: opts.author || '',
      totalPages: parseInt(opts.totalPages) || 0,
      pagesRead: 0,
      dailyGoal: parseInt(opts.dailyGoal) || 0,
    });
    save();
  };

  var toggleBook = function (id) {
    var b = state.booksList.find(function (x) { return x.id === id; });
    if (!b) return;
    b.read = !b.read;
    if (b.read) {
      playDone();
      b.finishedDate = todayStr();
      if (b.totalPages > 0) b.pagesRead = b.totalPages;
    } else {
      b.finishedDate = null;
    }
    save();
  };

  var addPages = function (id, count) {
    var b = state.booksList.find(function (x) { return x.id === id; });
    if (!b) return;
    b.pagesRead = Math.min((b.pagesRead || 0) + count, b.totalPages || Infinity);
    if (b.totalPages > 0 && b.pagesRead >= b.totalPages) {
      b.read = true;
      b.finishedDate = todayStr();
      playDone();
    }
    save();
  };

  var archiveBook = function (id) {
    var i = state.booksList.findIndex(function (x) { return x.id === id; });
    if (i === -1) return;
    playDelete();
    state.archive.push(state.booksList[i]);
    state.booksList.splice(i, 1);
    save();
  };

  var getBookCategories = function () {
    var cats = {};
    state.booksList.forEach(function (b) { cats[b.category || 'General'] = true; });
    return Object.keys(cats).sort();
  };

  // ─── CRUD: Archive ─────────────────────────────────────────
  var removeArchiveItem = function (id) {
    var i = state.archive.findIndex(function (x) { return x && x.id === id; });
    if (i === -1) {
      var idx = state.archive.findIndex(function (x) {
        if (!x) return false;
        return x[Object.keys(x)[0]] === id;
      });
      if (idx !== -1) { playDelete(); state.archive.splice(idx, 1); }
    } else { playDelete(); state.archive.splice(i, 1); }
    save();
  };

  var restoreArchiveItem = function (id) {
    var i = state.archive.findIndex(function (x) { return x && x.id === id; });
    if (i === -1) return;
    var item = state.archive[i];
    state.archive.splice(i, 1);
    if (item.task) { item.done = false; item.dueDate = item.dueDate || todayStr(); item.lastReset = todayStr(); if (!item.category) item.category = 'Main'; state.toDoList.push(item); sortTasks(); }
    else if (item.book) { item.read = false; if (!item.category) item.category = 'General'; state.booksList.push(item); }
    save();
  };

  var clearArchive = function () { playDelete(); state.archive = []; save(); };

  // ─── Export / Import ───────────────────────────────────────
  var exportData = function () {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'easy-day-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click(); URL.revokeObjectURL(a.href);
  };

  var importData = function (json) {
    try {
      var d = JSON.parse(json);
      if (!d.toDoList && !d.booksList) throw 0;
      state.toDoList = d.toDoList || []; state.booksList = d.booksList || []; state.archive = d.archive || [];
      save(); return true;
    } catch (_) { return false; }
  };

  // ─── Toast ─────────────────────────────────────────────────
  var toast = function (msg, type) {
    type = type || 'info';
    var c = $('#toasts');
    var icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    var el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + esc(msg);
    c.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 300); }, 2800);
  };

  var toggleModal = function (show) {
    var m = $('#shortcuts-modal');
    if (m) { if (show) m.classList.add('show'); else m.classList.remove('show'); }
  };

  // ─── Display helpers ───────────────────────────────────────
  var taskDateLabel = function (tItem) {
    if (!tItem.dueDate) return t('today');
    if (isToday(tItem.dueDate)) return t('today');
    if (isPast(tItem.dueDate)) return t('overdue');
    return formatDate(tItem.dueDate);
  };

  var taskBadges = function (t) {
    var h = '';
    if (t.daily) h += '<span class="tag tag-daily"><i class="fas fa-sync-alt"></i> ' + t('daily') + '</span>';
    if (t.repeatDays && t.repeatDays.length > 0 && !t.daily) {
      var l = state.lang || 'en';
      var names = t.repeatDays.map(function (d) { return DAYS_SHORT[l][d]; }).join(', ');
      h += '<span class="tag tag-repeat"><i class="fas fa-redo"></i> ' + esc(names) + '</span>';
    }
    if (t.category && t.category !== 'Main') {
      var cc = catColor(t.category);
      h += '<span class="tag tag-cat" style="background:' + cc.bg + ';color:' + cc.fg + '">' + esc(t.category) + '</span>';
    }
    return h;
  };

  var getVisibleTasks = function () {
    var today = todayStr();
    return state.toDoList.filter(function (t) {
      if (t.daily || (t.repeatDays && t.repeatDays.length > 0)) return true;
      if (!t.dueDate || t.dueDate <= today) return true;
      return false;
    });
  };

  var getFutureTasks = function () {
    var today = todayStr();
    return state.toDoList.filter(function (t) {
      if (t.daily || (t.repeatDays && t.repeatDays.length > 0)) return false;
      return t.dueDate && t.dueDate > today;
    });
  };

  var prioClass = function (p) { return p === 'HIGH' ? 'high' : p === 'MID' ? 'mid' : 'easy'; };

  // ============================================================
  //  RENDER
  // ============================================================
  var render = function () {
    document.documentElement.setAttribute('dir', state.lang === 'ar' ? 'rtl' : 'ltr');
    var app = $('#app');
    app.innerHTML =
      renderSidebar() +
      '<div class="main"><div class="main-inner">' +
      (currentView === 'tasks' ? renderTasks() : '') +
      (currentView === 'books' ? renderBooks() : '') +
      (currentView === 'archive' ? renderArchive() : '') +
      '</div></div>' +
      renderModal();
    bind();
  };

  // ─── Sidebar ───────────────────────────────────────────────
  var renderSidebar = function () {
    var tc = state.toDoList.filter(function (t) { return !t.done; }).length;
    var bc = state.booksList.filter(function (b) { return !b.read; }).length;
    var ac = state.archive.length;
    return '<nav class="sidebar">' +
      '<div class="sidebar-header">' +
      '<svg class="sidebar-icon" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="appicon-g" x1="0" y1="0" x2="120" y2="120"><stop offset="0%" stop-color="#5b7bfa"/><stop offset="100%" stop-color="#10b981"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(#appicon-g)"/><circle cx="78" cy="40" r="20" fill="#fff" opacity="0.3"/><path d="M26 96Q43 86 60 96Q77 86 94 96" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.5"/><path d="M32 64l22 22 36-46" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span class="sidebar-brand">Easy-Day</span>' +
      '</div>' +
      '<div class="sidebar-nav">' +
      navItem('tasks', 'fa-check-circle', t('tasks'), tc) +
      navItem('books', 'fa-book', t('books'), bc) +
      navItem('archive', 'fa-archive', t('archive'), ac) +
      '</div>' +
      '<div class="sidebar-actions">' +
      '<button class="sidebar-btn" id="btnTheme" title="' + t('theme') + '"><i class="fas ' + (getTheme() === 'dark' ? 'fa-sun' : 'fa-moon') + '"></i></button>' +
      '<button class="sidebar-btn" id="btnLang" title="اللغة / Language" style="font-weight:bold;font-size:11px;font-family:Arial"><i class="fas fa-globe"></i> ' + (state.lang === 'ar' ? 'EN' : 'ع') + '</button>' +
      '<button class="sidebar-btn" id="btnExport" title="' + t('export') + '"><i class="fas fa-download"></i></button>' +
      '<label class="sidebar-btn import-label" title="' + t('import') + '"><i class="fas fa-upload"></i><input type="file" id="importFile" accept=".json"></label>' +
      '<button class="sidebar-btn" id="btnShortcuts" title="' + t('shortcuts') + '"><i class="fas fa-keyboard"></i></button>' +
      '</div></nav>';
  };

  var navItem = function (view, icon, label, count) {
    return '<div class="nav-item ' + (currentView === view ? 'active' : '') + '" data-view="' + view + '">' +
      '<i class="fas ' + icon + '"></i><span class="nav-label">' + label + '</span>' +
      (count > 0 ? '<span class="nav-badge">' + count + '</span>' : '') + '</div>';
  };

  // ─── Tasks View ────────────────────────────────────────────
  var renderTasks = function () {
    var visible = getVisibleTasks();
    var future = getFutureTasks();
    var items = visible;
    if (searchQuery) items = items.filter(function (t) { return t.task.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1; });
    if (priorityFilter !== 'ALL') items = items.filter(function (t) { return t.priority === priorityFilter; });
    if (taskCatFilter !== 'ALL') items = items.filter(function (t) { return (t.category || 'Main') === taskCatFilter; });

    var total = visible.length;
    var done = visible.filter(function (t) { return t.done; }).length;
    var pct = total ? Math.round(done / total * 100) : 0;
    var cats = getTaskCategories();

    var h = '';

    // Hero Header
    var verseSrc = '﴿ وَالذَّاكِرِينَ اللَّهَ كَثِيرًا وَالذَّاكِرَاتِ أَعَدَّ اللَّهُ لَهُمْ مَغْفِرَةً وَأَجْرًا عَظِيمًا ﴾ [الأحزاب: 35]';
    h += '<div class="hero-header">' +
      '<div class="hero-top">' +
      '<h1 class="hero-day">' + (state.todayDate.dayName || '') + '</h1>' +
      '<div class="hero-date"><i class="far fa-calendar-alt"></i> ' + (state.todayDate.date || '') + '</div>' +
      '</div>' +
      '<div class="azkar-card" dir="rtl">' +
      '<div class="azkar-content">' +
      '<p class="azkar-text">' + esc(currentZikr.text) + '</p>' +
      '<span class="azkar-source">' + verseSrc + '</span>' +
      '</div>' +
      '<i class="fas fa-quote-left azkar-icon"></i>' +
      '</div>' +
      '</div>';

    // Form — priority color via data-priority
    h += '<form class="task-form compact" id="taskForm" data-priority="easy">' +
      '<select id="prioSelect"><option value="Easy">' + t('easy') + '</option><option value="MID">' + t('mid') + '</option><option value="HIGH">' + t('high') + '</option></select>' +
      '<input id="taskInput" type="text" placeholder="' + t('taskPlaceholder') + '" maxlength="120" autocomplete="off">' +
      '<button type="button" class="task-opts-btn" id="taskOptsBtn"><i class="fas fa-sliders-h"></i></button>' +
      '<button type="submit" class="task-form-btn"><i class="fas fa-plus"></i></button></form>';

    // Options panel
    var l = state.lang || 'en';
    h += '<div class="task-opts ' + (taskOptionsOpen ? 'open' : '') + '" id="taskOptsPanel"><div class="opts-row">' +
      '<div class="opt-group"><label class="opt-label"><i class="fas fa-calendar-alt"></i> ' + t('due') + '</label><input type="date" id="taskDate" value="' + todayStr() + '" min="' + todayStr() + '"></div>' +
      '<div class="opt-group"><label class="opt-label"><i class="fas fa-tag"></i> ' + t('category') + '</label><input type="text" id="taskCat" placeholder="' + t('main') + '" maxlength="20" class="opt-text-input"></div>' +
      '<div class="opt-group"><label class="opt-check"><input type="checkbox" id="taskDaily"> <span>' + t('daily') + '</span></label></div>' +
      '<div class="opt-group repeat-group"><label class="opt-label"><i class="fas fa-redo"></i> ' + t('repeat') + '</label><div class="day-pills" id="dayPills">' +
      DAYS_SHORT[l].map(function (d, i) { return '<button type="button" class="day-pill" data-day="' + i + '">' + d.charAt(0) + '</button>'; }).join('') +
      '</div></div></div></div>';

    // Stats
    h += '<div class="stats">' +
      '<div class="stat"><div class="stat-label">' + t('total') + '</div><div class="stat-val">' + total + '</div></div>' +
      '<div class="stat"><div class="stat-label">' + t('done') + '</div><div class="stat-val done">' + done + '</div></div>' +
      '<div class="stat"><div class="stat-label">' + t('left') + '</div><div class="stat-val remain">' + (total - done) + '</div></div>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>';

    // Toolbar — search + priority chips
    h += '<div class="toolbar"><div class="search-box"><i class="fas fa-search"></i><input id="searchInput" type="text" placeholder="' + t('search') + '..." value="' + esc(searchQuery) + '"></div>';
    ['ALL', 'HIGH', 'MID', 'Easy'].forEach(function (p) {
      h += '<button class="chip ' + (priorityFilter === p ? 'on' : '') + '" data-prio="' + p + '">' + (p === 'ALL' ? t('all') : p === 'Easy' ? t('easy') : t(p.toLowerCase())) + '</button>';
    });
    h += '</div>';

    // Category filter chips
    if (cats.length > 1) {
      h += '<div class="toolbar cat-toolbar"><span class="cat-label"><i class="fas fa-tag"></i></span>';
      h += '<button class="chip ' + (taskCatFilter === 'ALL' ? 'on' : '') + '" data-cat="ALL">' + t('all') + '</button>';
      cats.forEach(function (c) {
        var cc = catColor(c);
        var onStyle = taskCatFilter === c ? ' style="background:' + cc.bg + ';color:' + cc.fg + ';border-color:' + cc.fg + '"' : '';
        h += '<button class="chip ' + (taskCatFilter === c ? 'on' : '') + '" data-cat="' + esc(c) + '"' + onStyle + '>' + (c === 'Main' ? t('main') : esc(c)) + '</button>';
      });
      h += '</div>';
    }

    // Task list
    if (items.length === 0) {
      h += '<div class="empty"><div class="empty-icon"><i class="fas fa-clipboard-list"></i></div>' +
        '<h2>' + (searchQuery || priorityFilter !== 'ALL' || taskCatFilter !== 'ALL' ? t('noMatch') : t('noTasks')) + '</h2>' +
        '<p>' + (searchQuery || priorityFilter !== 'ALL' || taskCatFilter !== 'ALL' ? t('adjFilters') : t('addFirst')) + '</p></div>';
    } else {
      h += '<div class="list" id="taskList">';
      items.forEach(function (tItem) {
        var dl = taskDateLabel(tItem);
        var ov = dl === t('overdue');
        var tPct = tItem.done ? 100 : (tItem.progressPct || 0);
        h += '<div class="list-item' + (ov ? ' overdue' : '') + '" data-id="' + tItem.id + '">' +
          '<div class="item-main-area" style="position:relative; flex:1; display:flex; align-items:center; gap:10px; margin-block:-10px; margin-inline-start:-12px; padding-block:10px; padding-inline-start:12px; --progress:' + tPct + '%;">' +
          '<div class="check-box ' + (tItem.done ? 'checked' : '') + '" data-action="toggle">' + (tItem.done ? '<i class="fas fa-check"></i>' : '') + '</div>' +
          '<div class="item-body"><span class="item-text editable ' + (tItem.done ? 'done' : '') + '" data-action="edit-text">' + esc(tItem.task) + '</span>' +
          '<div class="item-tags">' + taskBadges(tItem) + '</div>' +
          (!tItem.done ? '<div class="item-slider-row"><input type="range" class="inline-slider" data-action="slide-task" value="' + tPct + '" min="0" max="100"><span class="slider-pct" style="font-size:10px;font-weight:700;margin:0 8px;min-width:30px;opacity:0.8">' + tPct + '%</span></div>' : '') +
          '</div>' +
          '</div>' +
          '<div class="item-meta"><span class="item-date ' + (ov ? 'text-red' : '') + '">' + esc(dl) + '</span>' +
          '<span class="badge badge-' + prioClass(tItem.priority) + '">' + (tItem.priority === 'Easy' ? t('easy') : t(tItem.priority.toLowerCase())) + '</span></div>' +
          '<button class="item-action" data-action="edit-details" data-type="task"><i class="fas fa-pen"></i></button>' +
          '<button class="item-action delete-action" data-action="archive"><i class="fas fa-trash"></i></button></div>';
      });
      h += '</div>';
    }

    // Future tasks
    if (future.length > 0) {
      h += '<div class="section-divider"><span>' + t('upcoming') + ' (' + future.length + ')</span></div>';
      h += '<div class="list list-future" id="futureList">';
      future.forEach(function (fItem) {
        h += '<div class="list-item future-item" data-id="' + fItem.id + '">' +
          '<div class="check-box" data-action="toggle"></div>' +
          '<div class="item-body"><span class="item-text editable" data-action="edit-text">' + esc(fItem.task) + '</span></div>' +
          '<div class="item-meta"><span class="item-date">' + formatDate(fItem.dueDate) + '</span>' +
          '<span class="badge badge-' + prioClass(fItem.priority) + '">' + (fItem.priority === 'Easy' ? t('easy') : t(fItem.priority.toLowerCase())) + '</span></div>' +
          '<button class="item-action delete-action" data-action="archive"><i class="fas fa-trash"></i></button></div>';
      });
      h += '</div>';
    }
    return h;
  };

  // ─── Books View ────────────────────────────────────────────
  var renderBooks = function () {
    var cats = getBookCategories();
    var items = state.booksList;
    if (bookCatFilter !== 'ALL') items = items.filter(function (b) { return (b.category || 'General') === bookCatFilter; });

    var readCount = state.booksList.filter(function (b) { return b.read; }).length;

    var h = '<div class="books-view">';
    h += '<div class="page-header"><div class="page-header-row"><h1>📚 ' + t('readList') + '</h1></div>' +
      '<div class="subtitle">' + state.booksList.length + ' ' + t('book') + (state.booksList.length !== 1 && state.lang !== 'ar' ? 's' : '') + ' · ' + readCount + ' ' + t('read') + '</div></div>';

    // Book form
    h += '<form class="task-form books-form compact" id="bookForm">' +
      '<input id="bookInput" type="text" placeholder="' + t('addBook') + '" maxlength="120" autocomplete="off" style="padding-left:14px">' +
      '<button type="button" class="task-opts-btn" id="bookOptsBtn"><i class="fas fa-sliders-h"></i></button>' +
      '<button type="submit" class="task-form-btn"><i class="fas fa-plus"></i></button></form>';

    // Book options
    h += '<div class="task-opts ' + (bookOptionsOpen ? 'open' : '') + '" id="bookOptsPanel"><div class="opts-row">' +
      '<div class="opt-combo-group">' +
      '<div class="opt-input-wrap"><i class="fas fa-book-open"></i><input type="number" id="bookPages" placeholder="' + t('totalPg') + '" min="0" class="opt-num-clean"></div>' +
      '<div class="opt-combo-divider">/</div>' +
      '<div class="opt-input-wrap"><i class="fas fa-bullseye" style="color:var(--green)"></i><input type="number" id="bookGoal" placeholder="' + t('dailyGl') + '" min="0" class="opt-num-clean"></div>' +
      '</div>' +
      '<div class="opt-combo-group">' +
      '<div class="opt-input-wrap"><i class="fas fa-user-edit"></i><input type="text" id="bookAuthor" placeholder="' + t('authorEx') + '" maxlength="30" class="opt-text-clean"></div>' +
      '<div class="opt-combo-divider">/</div>' +
      '<div class="opt-input-wrap"><i class="fas fa-tag"></i><input type="text" id="bookCat" placeholder="' + t('catEx') + '" maxlength="20" class="opt-text-clean"></div>' +
      '</div>' +
      '</div></div>';

    // Category filter
    if (cats.length > 1) {
      h += '<div class="toolbar cat-toolbar"><span class="cat-label"><i class="fas fa-tag"></i></span>';
      h += '<button class="chip ' + (bookCatFilter === 'ALL' ? 'on' : '') + '" data-bcat="ALL">' + t('all') + '</button>';
      cats.forEach(function (c) {
        var cc = catColor(c);
        var onStyle = bookCatFilter === c ? ' style="background:' + cc.bg + ';color:' + cc.fg + ';border-color:' + cc.fg + '"' : '';
        h += '<button class="chip ' + (bookCatFilter === c ? 'on' : '') + '" data-bcat="' + esc(c) + '"' + onStyle + '>' + (c === 'General' ? t('general') : esc(c)) + '</button>';
      });
      h += '</div>';
    }

    // Book list
    if (items.length === 0) {
      h += '<div class="empty"><div class="empty-icon"><i class="fas fa-book-open"></i></div><h2>' + (bookCatFilter !== 'ALL' ? t('noCatBooks') : t('noBooks')) + '</h2><p>' + (bookCatFilter !== 'ALL' ? t('tryCat') : t('startRead')) + '</p></div>';
    } else {
      h += '<div class="list" id="bookList">';
      items.forEach(function (b) {
        var hasPg = b.totalPages > 0;
        var pgPct = hasPg ? Math.min(Math.round((b.pagesRead || 0) / b.totalPages * 100), 100) : (b.manualPct || (b.read ? 100 : 0));
        var itemMetaHtml = '';
        if (b.read) {
          itemMetaHtml += '<span class="item-date">' + t('finished') + ' ' + formatDate(b.finishedDate || todayStr()) + '</span>';
        } else {
          if (hasPg && b.dailyGoal > 0) {
            var rem = b.totalPages - (b.pagesRead || 0);
            var daysRem = Math.ceil(rem / b.dailyGoal);
            var estDate = new Date();
            estDate.setDate(estDate.getDate() + daysRem);
            var isoEst = estDate.getFullYear() + '-' + String(estDate.getMonth() + 1).padStart(2, '0') + '-' + String(estDate.getDate()).padStart(2, '0');
            itemMetaHtml += '<span class="item-date" style="color:var(--green);font-size:9px;text-transform:uppercase;font-weight:700">' + t('expected') + ' ' + formatDate(isoEst) + '</span>';
          }
          if (b.author) itemMetaHtml += '<span class="item-date" style="margin-right:4px"><i class="fas fa-user"></i> ' + esc(b.author) + '</span>';
          itemMetaHtml += '<button class="add-pages-btn" data-action="addpages"><i class="fas fa-plus-circle"></i></button>';
          itemMetaHtml += '<span class="item-date" style="opacity:0.6">' + t('added') + ' ' + formatDate(b.added) + '</span>';
        }

        h += '<div class="list-item book-item" data-id="' + b.id + '">' +
          '<div class="item-main-area" style="position:relative; flex:1; display:flex; align-items:center; gap:10px; margin-block:-10px; margin-inline-start:-12px; padding-block:10px; padding-inline-start:12px; --progress:' + pgPct + '%;">' +
          '<div class="check-box ' + (b.read ? 'checked' : '') + '" data-action="toggle">' + (b.read ? '<i class="fas fa-check"></i>' : '') + '</div>' +
          '<div class="item-body">' +
          '<span class="item-text ' + (b.read ? 'done' : '') + '">' + esc(b.book) + '</span>' +
          '<div class="item-tags">' +
          (b.category && b.category !== 'General' ? (function () { var cc = catColor(b.category); return '<span class="tag tag-cat" style="background:' + cc.bg + ';color:' + cc.fg + '">' + esc(b.category) + '</span>'; })() : '') +
          (b.dailyGoal > 0 ? '<span class="tag tag-daily"><i class="fas fa-bullseye"></i> ' + b.dailyGoal + ' ' + t('pgDay') + '</span>' : '') +
          '</div>' +
          '<div class="book-progress">' +
          (hasPg ? '<div class="book-progress-track"><div class="book-progress-fill" style="width:' + pgPct + '%"></div></div>' : '') +
          '<span class="book-progress-text">' + ((b.pagesRead || 0) + (hasPg ? '/' + b.totalPages : '')) + ' ' + t('pg') + '</span></div>' +
          (!b.read ? '<div class="item-slider-row"><input type="range" class="inline-slider" data-action="slide-book" value="' + (hasPg ? (b.pagesRead || 0) : pgPct) + '" min="0" max="' + (hasPg ? b.totalPages : 100) + '"><span class="slider-pct" style="font-size:10px;font-weight:700;margin:0 8px;min-width:30px;opacity:0.8">' + pgPct + '%</span></div>' : '') +
          '</div>' +
          '</div>' +
          '<div class="item-meta book-meta">' +
          itemMetaHtml +
          '<button class="item-action" data-action="edit-details" data-type="book"><i class="fas fa-pen"></i></button>' +
          '<button class="item-action delete-action" data-action="archive"><i class="fas fa-trash"></i></button></div></div>';
      });
      h += '</div>';
    }
    h += '</div>';
    return h;
  };

  // ─── Archive View ──────────────────────────────────────────
  var renderArchive = function () {
    var items = state.archive.filter(Boolean);
    var h = '<div class="page-header"><div class="page-header-row"><h1>🗄️ ' + t('archive') + '</h1></div>' +
      '<div class="subtitle">' + items.length + '</div></div>';
    if (items.length === 0) {
      h += '<div class="empty"><div class="empty-icon"><i class="fas fa-archive"></i></div><h2>' + t('archEmpty') + '</h2><p>' + t('archSub') + '</p></div>';
    } else {
      h += '<div class="list" id="archiveList">';
      items.forEach(function (item) {
        var key = item.task ? 'task' : item.book ? 'book' : Object.keys(item)[0];
        var name = item[key] || '(Unknown)';
        var icon = key === 'task' ? 'fa-check-circle' : key === 'book' ? 'fa-book' : 'fa-box';
        var id = item.id || name;
        var canRestore = !!(item.task || item.book);
        var metaHtml = '<span class="item-date">' + (item.added ? formatDate(item.added) : '') + '</span>';
        if (item.category) metaHtml += ' &middot; <span class="tag tag-cat" style="opacity:0.7">' + esc(item.category) + '</span>';
        if (key === 'task' && item.progressPct > 0) metaHtml += ' &middot; <span class="item-date">' + item.progressPct + '%</span>';
        if (key === 'book' && item.pagesRead > 0) metaHtml += ' &middot; <span class="item-date">' + item.pagesRead + ' ' + t('pg') + '</span>';

        h += '<div class="list-item" data-id="' + esc(String(id)) + '">' +
          '<div class="type-icon"><i class="fas ' + icon + '"></i></div>' +
          '<span class="item-text">' + esc(String(name)) + '</span>' +
          '<div class="item-meta">' + metaHtml + '</div>' +
          (canRestore ? '<button class="item-action restore-action" data-action="restore"><i class="fas fa-undo"></i></button>' : '') +
          '<button class="item-action" data-action="delete"><i class="fas fa-trash"></i></button></div>';
      });
      h += '</div>';
      h += '<button class="clear-btn" id="clearArchive"><i class="fas fa-trash-alt"></i> ' + t('clrArch') + '</button>';
    }
    return h;
  };

  // ─── Modal ─────────────────────────────────────────────────
  var renderModal = function () {
    return '<div class="modal-bg" id="shortcuts-modal"><div class="modal-box">' +
      '<div class="modal-title"><h3><i class="fas fa-keyboard"></i> ' + t('shortcuts') + '</h3><button class="modal-close" id="closeModal"><i class="fas fa-times"></i></button></div>' +
      '<div class="shortcut-row"><kbd>N</kbd><span>' + t('newTask') + '</span></div>' +
      '<div class="shortcut-row"><kbd>/</kbd><span>' + t('search') + '</span></div>' +
      '<div class="shortcut-row"><kbd>1</kbd><span>' + t('tasks') + '</span></div>' +
      '<div class="shortcut-row"><kbd>2</kbd><span>' + t('books') + '</span></div>' +
      '<div class="shortcut-row"><kbd>3</kbd><span>' + t('archive') + '</span></div>' +
      '<div class="shortcut-row"><kbd>T</kbd><span>' + t('theme') + '</span></div>' +
      '<div class="shortcut-row"><kbd>?</kbd><span>' + t('help') + '</span></div>' +
      '<div class="shortcut-row"><kbd>Esc</kbd><span>' + t('closeClear') + '</span></div>' +
      '</div></div>';
  };

  var showEditModal = function (id, type) {
    var item = (type === 'task' ? state.toDoList : state.booksList).find(function (x) { return x.id === id; });
    if (!item) return;

    var m = document.createElement('div');
    m.className = 'modal-bg show edit-modal';

    var h = '<div class="modal-box" style="padding:26px"><div class="modal-title" style="margin-bottom:20px"><h3>' + t('editTitle') + '</h3><button type="button" class="modal-close" onclick="this.closest(\'.modal-bg\').remove()"><i class="fas fa-times"></i></button></div>';
    h += '<div style="display:flex;flex-direction:column;gap:12px">';
    h += '<label style="font-size:11px;color:var(--text-300);font-weight:600">' + t('category') + ': <input type="text" id="em-cat" class="opt-text-input" style="width:100%;margin-top:4px" value="' + esc(item.category || '') + '"></label>';

    if (type === 'task') {
      h += '<label style="font-size:11px;color:var(--text-300);font-weight:600">' + t('due') + ': <input type="date" id="em-date" class="opt-text-input" style="width:100%;margin-top:4px" value="' + esc(item.dueDate || '') + '"></label>';
    } else {
      h += '<div style="display:flex;gap:10px;margin-bottom:8px">';
      h += '<label style="flex:1;font-size:11px;color:var(--text-300);font-weight:600">' + t('pgRead') + ': <input type="number" id="em-pr" class="opt-num-input" style="width:100%;margin-top:4px" value="' + (item.pagesRead || '') + '" min="0"></label>';
      h += '<label style="flex:1;font-size:11px;color:var(--text-300);font-weight:600">' + t('author') + ': <input type="text" id="em-author" class="opt-text-input" style="width:100%;margin-top:4px" value="' + esc(item.author || '') + '"></label>';
      h += '</div><div style="display:flex;gap:10px">';
      h += '<label style="flex:1;font-size:11px;color:var(--text-300);font-weight:600">' + t('totalPg') + ': <input type="number" id="em-tp" class="opt-num-input" style="width:100%;margin-top:4px" value="' + (item.totalPages || '') + '" min="0"></label>';
      h += '<label style="flex:1;font-size:11px;color:var(--text-300);font-weight:600">' + t('dailyGl') + ': <input type="number" id="em-dg" class="opt-num-input" style="width:100%;margin-top:4px" value="' + (item.dailyGoal || '') + '" min="0"></label>';
      h += '</div>';
    }

    h += '<button type="button" id="em-save" style="margin-top:10px;padding:10px;background:var(--blue);color:#fff;border-radius:var(--radius-sm);font-weight:700">' + t('saveChanges') + '</button>';
    h += '</div></div>';
    m.innerHTML = h;
    document.body.appendChild(m);

    var saveBtn = m.querySelector('#em-save');
    saveBtn.addEventListener('click', function () {
      var cat = m.querySelector('#em-cat').value.trim();
      item.category = cat ? titleCase(cat) : (type === 'task' ? 'Main' : 'General');

      if (type === 'task') {
        item.dueDate = m.querySelector('#em-date').value || null;
      } else {
        item.pagesRead = parseInt(m.querySelector('#em-pr').value) || 0;
        item.totalPages = parseInt(m.querySelector('#em-tp').value) || 0;
        item.dailyGoal = parseInt(m.querySelector('#em-dg').value) || 0;
        item.author = m.querySelector('#em-author').value.trim();
        if (item.totalPages > 0) {
          item.manualPct = Math.min(Math.round(item.pagesRead / item.totalPages * 100), 100);
        }
        if (item.totalPages > 0 && item.pagesRead >= item.totalPages && !item.read) {
          item.read = true; item.finishedDate = todayStr(); playDone();
        } else if (item.read && ((item.totalPages > 0 && item.pagesRead < item.totalPages) || (item.totalPages === 0 && item.manualPct < 100))) {
          item.read = false; item.finishedDate = null;
        }
      }

      save(); render();
      toast('Changes saved', 'success');
      m.remove();
    });
  };

  // ============================================================
  //  EVENT BINDING
  // ============================================================
  var selectedRepeatDays = [];

  var bind = function () {
    // Nav
    $$('.nav-item').forEach(function (el) {
      el.addEventListener('click', function () {
        currentView = el.dataset.view;
        searchQuery = ''; priorityFilter = 'ALL'; taskCatFilter = 'ALL'; bookCatFilter = 'ALL';
        render();
      });
    });

    // Theme
    var btnTheme = $('#btnTheme');
    if (btnTheme) btnTheme.addEventListener('click', function () {
      var thm = getTheme() === 'dark' ? 'light' : 'dark'; setTheme(thm); render();
      toast(t('theme'), 'info');
    });

    // Language toggle
    var btnLang = $('#btnLang');
    if (btnLang) btnLang.addEventListener('click', function () {
      state.lang = state.lang === 'ar' ? 'en' : 'ar';
      initDate();
      save(); render();
    });

    // Export
    var btnExport = $('#btnExport');
    if (btnExport) btnExport.addEventListener('click', function () { exportData(); toast(t('dataExp'), 'success'); });

    // Import
    var importFile = $('#importFile');
    if (importFile) importFile.addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function (ev) {
        if (importData(ev.target.result)) { toast(t('dataImp'), 'success'); render(); }
        else toast(t('impFail'), 'error');
      };
      r.readAsText(f); e.target.value = '';
    });

    // Modal
    var btnShortcuts = $('#btnShortcuts');
    if (btnShortcuts) btnShortcuts.addEventListener('click', function () { toggleModal(true); });
    var closeModal = $('#closeModal');
    if (closeModal) closeModal.addEventListener('click', function () { toggleModal(false); });
    var modalBg = $('#shortcuts-modal');
    if (modalBg) modalBg.addEventListener('click', function (e) { if (e.target === modalBg) toggleModal(false); });

    // === TASKS VIEW ===
    if (currentView === 'tasks') {
      // Priority color on form
      var prioSel = $('#prioSelect');
      var taskFormEl = $('#taskForm');
      if (prioSel && taskFormEl) {
        var updateFormColor = function () {
          taskFormEl.setAttribute('data-priority', prioClass(prioSel.value));
        };
        prioSel.addEventListener('change', updateFormColor);
        updateFormColor();
      }

      // Options toggle
      var optsBtn = $('#taskOptsBtn');
      if (optsBtn) optsBtn.addEventListener('click', function () {
        taskOptionsOpen = !taskOptionsOpen;
        var panel = $('#taskOptsPanel');
        if (panel) panel.classList.toggle('open', taskOptionsOpen);
      });

      // Day pills
      selectedRepeatDays = [];
      $$('.day-pill').forEach(function (pill) {
        pill.addEventListener('click', function () {
          var day = parseInt(pill.dataset.day);
          var idx = selectedRepeatDays.indexOf(day);
          if (idx === -1) { selectedRepeatDays.push(day); pill.classList.add('on'); }
          else { selectedRepeatDays.splice(idx, 1); pill.classList.remove('on'); }
        });
      });

      var dailyCheck = $('#taskDaily');
      if (dailyCheck) dailyCheck.addEventListener('change', function () {
        var pills = $('#dayPills');
        if (pills) { pills.style.opacity = dailyCheck.checked ? '0.3' : '1'; pills.style.pointerEvents = dailyCheck.checked ? 'none' : 'auto'; }
      });

      // Form submit
      var form = $('#taskForm');
      if (form) form.addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = $('#taskInput'); var val = inp.value.trim(); if (!val) return;
        var opts = {};
        var dateInp = $('#taskDate');
        if (dateInp && dateInp.value) opts.dueDate = dateInp.value;
        var dailyInp = $('#taskDaily');
        if (dailyInp && dailyInp.checked) opts.daily = true;
        if (!opts.daily && selectedRepeatDays.length > 0) opts.repeatDays = selectedRepeatDays.slice();
        var catInp = $('#taskCat');
        opts.category = (catInp && catInp.value.trim()) ? titleCase(catInp.value.trim()) : 'Main';
        addTask(val, $('#prioSelect').value, opts);
        toast(t('taskAdded'), 'success');
        selectedRepeatDays = [];
        render();
        setTimeout(function () { var i = $('#taskInput'); if (i) i.focus(); }, 50);
      });

      // Search
      var searchInp = $('#searchInput');
      if (searchInp) searchInp.addEventListener('input', function (e) {
        searchQuery = e.target.value; render();
        var ni = $('#searchInput');
        if (ni) { ni.focus(); ni.selectionStart = ni.selectionEnd = searchQuery.length; }
      });

      // Priority chips
      $$('.chip[data-prio]').forEach(function (ch) {
        ch.addEventListener('click', function () { priorityFilter = ch.dataset.prio; render(); });
      });

      // Category chips
      $$('.chip[data-cat]').forEach(function (ch) {
        ch.addEventListener('click', function () { taskCatFilter = ch.dataset.cat; render(); });
      });

      // Task list events
      ['#taskList', '#futureList'].forEach(function (sel) {
        var listEl = $(sel); if (!listEl) return;
        listEl.addEventListener('click', function (e) {
          var item = e.target.closest('.list-item'); if (!item) return;
          var id = item.dataset.id;
          var action = e.target.closest('[data-action]'); if (!action) return;
          if (action.dataset.action === 'toggle') { toggleTask(id); render(); }
          if (action.dataset.action === 'edit-details') { showEditModal(id, 'task'); }
          if (action.dataset.action === 'archive') {
            item.classList.add('anim-slide-out');
            setTimeout(function () { archiveTask(id); toast(t('taskArch'), 'info'); render(); }, 350);
          }
        });

        // Removed native input slider events from isolated local scope

        listEl.addEventListener('input', function (e) {
          if (e.target.classList.contains('inline-slider') && e.target.dataset.action === 'slide-task') {
            var val = e.target.value;
            var item = e.target.closest('.item-main-area');
            if (item) item.style.setProperty('--progress', val + '%');
            var txt = e.target.parentElement.querySelector('.slider-pct');
            if (txt) txt.innerHTML = val + '%';
          }
        });

        listEl.addEventListener('change', function (e) {
          if (e.target.classList.contains('inline-slider')) {
            var id = e.target.closest('.list-item').dataset.id;
            var val = parseInt(e.target.value);
            if (e.target.dataset.action === 'slide-task') {
              var t = state.toDoList.find(function (x) { return x.id === id; });
              if (t) {
                var prevDone = t.done;
                t.progressPct = val;
                if (val === 100 && !t.done) { t.done = true; playDone(); }
                else if (val < 100 && t.done) { t.done = false; }
                save();
                if (t.done !== prevDone) render();
              }
            }
          }
        });

        listEl.addEventListener('dblclick', function (e) {
          var textEl = e.target.closest('[data-action="edit-text"]'); if (!textEl) return;
          var item = textEl.closest('.list-item'); if (!item) return;
          var id = item.dataset.id;
          var t = state.toDoList.find(function (x) { return x.id === id; }); if (!t) return;
          var input = document.createElement('input');
          input.className = 'inline-edit'; input.value = t.task; input.maxLength = 120;
          textEl.replaceWith(input); input.focus(); input.select();
          var finished = false;
          var finish = function () {
            if (finished) return; finished = true;
            var v = input.value.trim();
            if (v && v !== tItem.task) { editTask(id, v); toast(t('taskUpd'), 'success'); }
            render();
          };
          input.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); finish(); }
            if (ev.key === 'Escape') { finished = true; render(); }
          });
          input.addEventListener('blur', finish);
        });
      });
    }

    // === BOOKS VIEW ===
    if (currentView === 'books') {
      // Options toggle
      var bOptsBtn = $('#bookOptsBtn');
      if (bOptsBtn) bOptsBtn.addEventListener('click', function () {
        bookOptionsOpen = !bookOptionsOpen;
        var panel = $('#bookOptsPanel');
        if (panel) panel.classList.toggle('open', bookOptionsOpen);
      });

      // Form submit
      var bookForm = $('#bookForm');
      if (bookForm) bookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = $('#bookInput'); var val = inp.value.trim(); if (!val) return;
        var opts = {};
        var pgInp = $('#bookPages'); opts.totalPages = pgInp ? pgInp.value : 0;
        var goalInp = $('#bookGoal'); opts.dailyGoal = goalInp ? goalInp.value : 0;
        var catInp = $('#bookCat'); opts.category = (catInp && catInp.value.trim()) ? titleCase(catInp.value.trim()) : 'General';
        var authInp = $('#bookAuthor'); opts.author = authInp ? authInp.value.trim() : '';
        addBook(val, opts);
        toast(t('bookAdded'), 'success'); render();
        setTimeout(function () { var i = $('#bookInput'); if (i) i.focus(); }, 50);
      });

      // Category chips
      $$('.chip[data-bcat]').forEach(function (ch) {
        ch.addEventListener('click', function () { bookCatFilter = ch.dataset.bcat; render(); });
      });

      // Book list events
      var bookList = $('#bookList');
      if (bookList) bookList.addEventListener('click', function (e) {
        var item = e.target.closest('.list-item'); if (!item) return;
        var id = item.dataset.id;
        var action = e.target.closest('[data-action]'); if (!action) return;

        if (action.dataset.action === 'toggle') { toggleBook(id); render(); }
        if (action.dataset.action === 'edit-details') { showEditModal(id, 'book'); }
        if (action.dataset.action === 'archive') {
          item.classList.add('anim-slide-out');
          setTimeout(function () { archiveBook(id); toast(t('bookArch'), 'info'); render(); }, 350);
        }
        if (action.dataset.action === 'addpages') {
          // Create inline pages input
          var existing = item.querySelector('.pages-input-inline');
          if (existing) return;
          var wrap = document.createElement('div');
          wrap.className = 'pages-input-inline';
          wrap.innerHTML = '<input type="number" min="1" placeholder="Pages" class="pg-input" autofocus><button class="pg-ok"><i class="fas fa-check"></i></button>';
          action.replaceWith(wrap);
          var pgInput = wrap.querySelector('.pg-input');
          pgInput.focus();
          var submit = function () {
            var v = parseInt(pgInput.value);
            if (v > 0) { addPages(id, v); toast('+' + v + ' ' + t('pg'), 'success'); }
            render();
          };
          pgInput.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); submit(); }
            if (ev.key === 'Escape') render();
          });
          wrap.querySelector('.pg-ok').addEventListener('click', submit);
          pgInput.addEventListener('blur', function () { setTimeout(submit, 100); });
        }
      });

      bookList.addEventListener('input', function (e) {
        if (e.target.classList.contains('inline-slider') && e.target.dataset.action === 'slide-book') {
          var val = parseInt(e.target.value);
          var max = parseInt(e.target.max) || 100;
          var pct = Math.round((val / max) * 100);
          var item = e.target.closest('.item-main-area');
          if (item) item.style.setProperty('--progress', pct + '%');
          var pctTxt = e.target.parentElement.querySelector('.slider-pct');
          if (pctTxt) pctTxt.innerHTML = pct + '%';

          var prgFill = e.target.closest('.item-body').querySelector('.book-progress-fill');
          if (prgFill) prgFill.style.width = pct + '%';
          var prgTxt = e.target.closest('.item-body').querySelector('.book-progress-text');
          if (prgTxt) {
            var origTxt = prgTxt.innerHTML;
            if (origTxt.indexOf('/') !== -1) {
              var maxValStr = origTxt.split('/')[1].split(' ')[0];
              prgTxt.innerHTML = val + '/' + maxValStr + ' ' + t('pg');
            } else {
              prgTxt.innerHTML = val + ' ' + t('pg');
            }
          }
        }
      });

      bookList.addEventListener('change', function (e) {
        if (e.target.classList.contains('inline-slider')) {
          var id = e.target.closest('.list-item').dataset.id;
          var val = parseInt(e.target.value);
          if (e.target.dataset.action === 'slide-book') {
            var b = state.booksList.find(function (x) { return x.id === id; });
            if (b) {
              var prevRead = b.read;
              if (b.totalPages > 0) {
                b.pagesRead = val;
                b.manualPct = Math.round((b.pagesRead / b.totalPages) * 100);
              } else {
                b.manualPct = val;
              }
              if ((b.totalPages > 0 && b.pagesRead >= b.totalPages && !b.read) || (b.totalPages === 0 && b.manualPct >= 100 && !b.read)) {
                b.read = true; b.finishedDate = todayStr(); playDone();
                if (b.totalPages === 0) b.manualPct = 100;
              } else if (b.read && ((b.totalPages > 0 && b.pagesRead < b.totalPages) || (b.totalPages === 0 && b.manualPct < 100))) {
                b.read = false; b.finishedDate = null;
              }
              save();
              if (b.read !== prevRead) render();
            }
          }
        }
      });
    }

    // === ARCHIVE VIEW ===
    if (currentView === 'archive') {
      var archiveList = $('#archiveList');
      if (archiveList) archiveList.addEventListener('click', function (e) {
        var item = e.target.closest('.list-item'); if (!item) return;
        var action = e.target.closest('[data-action]'); if (!action) return;
        var id = item.dataset.id;
        if (action.dataset.action === 'restore') {
          item.classList.add('anim-slide-out');
          setTimeout(function () { restoreArchiveItem(id); toast(t('restored'), 'success'); render(); }, 350);
        }
        if (action.dataset.action === 'delete') {
          item.classList.add('anim-slide-out');
          setTimeout(function () { removeArchiveItem(id); toast(t('deleted'), 'error'); render(); }, 350);
        }
      });
      var clearBtn = $('#clearArchive');
      if (clearBtn) clearBtn.addEventListener('click', function () { clearArchive(); toast(t('archCleared'), 'error'); render(); });
    }
  };

  // ============================================================
  //  GLOBAL EVENT LISTENERS
  // ============================================================
  document.body.addEventListener('input', function (e) {
    if (e.target.classList.contains('inline-slider')) {
      var val = e.target.value;
      var row = e.target.closest('.item-slider-row');
      if (row) {
        var pctSpan = row.querySelector('.slider-pct');
        if (pctSpan) pctSpan.textContent = val + '%';
      }
      var item = e.target.closest('.list-item');
      if (item) item.style.setProperty('--progress', val + '%');
    }
  });

  // ============================================================
  //  KEYBOARD SHORTCUTS
  // ============================================================
  document.addEventListener('keydown', function (e) {
    var typing = ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) !== -1;
    if (e.key === 'Escape') {
      var m = $('#shortcuts-modal');
      if (m && m.classList.contains('show')) { toggleModal(false); return; }
      if (typing) { document.activeElement.blur(); return; }
      if (searchQuery) { searchQuery = ''; render(); return; }
    }
    if (typing) return;
    switch (e.key) {
      case 'n': case 'N': e.preventDefault(); currentView = 'tasks'; render(); setTimeout(function () { var i = $('#taskInput'); if (i) i.focus(); }, 50); break;
      case '/': e.preventDefault(); currentView = 'tasks'; render(); setTimeout(function () { var i = $('#searchInput'); if (i) i.focus(); }, 50); break;
      case '1': currentView = 'tasks'; searchQuery = ''; priorityFilter = 'ALL'; taskCatFilter = 'ALL'; render(); break;
      case '2': currentView = 'books'; bookCatFilter = 'ALL'; render(); break;
      case '3': currentView = 'archive'; render(); break;
      case 't': case 'T': var t = getTheme() === 'dark' ? 'light' : 'dark'; setTheme(t); render(); toast(t.charAt(0).toUpperCase() + t.slice(1) + ' mode', 'info'); break;
      case '?': toggleModal(true); break;
    }
  });

  // ============================================================
  //  INIT
  // ============================================================
  load();
  initDate();
  dailyReset();
  setTheme(getTheme());
  loadAzkar();
  render();

})();
