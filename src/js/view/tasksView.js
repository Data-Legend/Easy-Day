import View from "./view.js";

class TasksView extends View {
  _parentEl = document.querySelector('#tasksSection');
  _form = document.querySelector('#taskForm');
  _searchInput = document.querySelector('#searchInput');
  _searchClear = document.querySelector('#searchClear');
  _statsBar = document.querySelector('#statsBar');
  _filterQuery = '';
  _filterPriority = 'ALL';

  htmlGenerator() {
    // Update stats
    this.updateStats();

    // Filter data
    let filteredData = this._data;
    if (this._filterQuery) {
      const query = this._filterQuery.toLowerCase();
      filteredData = filteredData.filter(t => t.task.toLowerCase().includes(query));
    }
    if (this._filterPriority !== 'ALL') {
      filteredData = filteredData.filter(t => t.priority === this._filterPriority);
    }

    const filterBar = this.filterBarGen();
    const header = this.checkTasks(filteredData);
    const liMarkup = filteredData.map(task => {
      const priorityClass = task.priority === 'Easy' ? 'priority-easy' :
        task.priority === 'HIGH' ? 'priority-high' : 'priority-mid';
      return `
            <li data-name="${this.escapeHtml(task.task)}">
                <i class="fas ${task.done ? 'checked-icon fa-check-square' : 'fa-square'} check-task"></i>
                <p class="${task.done ? 'task-done' : ''}">${this.escapeHtml(task.task)}</p>
                <span class="remove-item"><i class="fas fa-trash"></i></span>
                <div>
                    <span>${this.escapeHtml(task.due)}</span>
                    <span class="priority-badge ${priorityClass}">${this.escapeHtml(task.priority)}</span>
                </div>
            </li>
            `;
    }).join("");

    return `${filterBar}${header}<div class="tasks-list"><ul class="today-s-list">${liMarkup}</ul></div>`;
  }

  filterBarGen() {
    const priorities = ['ALL', 'HIGH', 'MID', 'Easy'];
    return `
        <div class="filter-bar">
            ${priorities.map(p => `
                <button class="filter-btn ${this._filterPriority === p ? 'active' : ''}" data-priority="${p}">
                    ${p === 'Easy' ? 'EASY' : p}
                </button>
            `).join('')}
        </div>
        `;
  }

  updateStats() {
    const total = this._data.length;
    const done = this._data.filter(t => t.done).length;
    const remaining = total - done;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const statTotal = document.getElementById('statTotal');
    const statDone = document.getElementById('statDone');
    const statRemaining = document.getElementById('statRemaining');
    const progressBar = document.getElementById('statsProgressBar');

    if (statTotal) statTotal.textContent = total;
    if (statDone) statDone.textContent = done;
    if (statRemaining) statRemaining.textContent = remaining;
    if (progressBar) progressBar.style.width = `${pct}%`;
  }

  checkTasks(data) {
    if (data.length < 1) {
      return `
            <div class="empty-state">
                <div class="empty-state__icon"><i class="fas fa-clipboard-list"></i></div>
                <h2>No tasks yet</h2>
                <p>Add a new task to get started with your day!</p>
            </div>`;
    }
    return `
        <div class="tasks-header">
            <p>Archive</p> <p class="due">DUE</p><p>PRIORITY</p>
        </div>
        `;
  }

  addTaskHandler(handler) {
    this._form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = document.querySelector('#taskInput');
      const priority = document.querySelector('#priority');
      const inputVal = input.value.trim();
      if (inputVal.length < 1) return;
      const priorityVal = priority.value;
      input.value = '';
      handler(inputVal, priorityVal);
    });
  }

  addTaskDoneHandler(handler) {
    this._parentEl.addEventListener('click', function (e) {
      if (!e.target.classList.contains('check-task') && !e.target.closest('.check-task')) return;
      const li = e.target.closest('li');
      if (li) handler(li.dataset.name);
    });
  }

  removeTaskDoneHandler(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const span = e.target.closest('.remove-item');
      if (!span) return;
      const li = e.target.closest('li');
      if (li) {
        li.classList.add('disappear');
        setTimeout(() => handler(li.dataset.name), 500);
      }
    });
  }

  // Inline editing: double-click to edit task name
  addEditHandler(handler) {
    this._parentEl.addEventListener('dblclick', function (e) {
      const li = e.target.closest('li');
      const p = li ? li.querySelector('p') : null;
      if (!li || !p || e.target.closest('.remove-item') || e.target.closest('.check-task')) return;

      const oldName = li.dataset.name;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = oldName;
      input.className = 'inline-edit-input';
      input.maxLength = 120;
      p.replaceWith(input);
      input.focus();
      input.select();

      const save = () => {
        const newName = input.value.trim();
        if (newName && newName !== oldName) {
          handler(oldName, newName);
        } else {
          // Restore original
          const newP = document.createElement('p');
          newP.textContent = oldName;
          input.replaceWith(newP);
        }
      };

      input.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); save(); }
        if (ev.key === 'Escape') {
          const newP = document.createElement('p');
          newP.textContent = oldName;
          input.replaceWith(newP);
        }
      });
      input.addEventListener('blur', save);
    });
  }

  // Search handler
  addSearchHandler(handler) {
    const self = this;
    this._searchInput.addEventListener('input', function () {
      self._filterQuery = this.value;
      handler();
    });
    this._searchClear.addEventListener('click', function () {
      self._searchInput.value = '';
      self._filterQuery = '';
      handler();
    });
  }

  // Priority filter handler
  addFilterHandler(handler) {
    const self = this;
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      self._filterPriority = btn.dataset.priority;
      handler();
    });
  }

  clearSearch() {
    this._filterQuery = '';
    this._filterPriority = 'ALL';
    if (this._searchInput) this._searchInput.value = '';
  }
}

export default new TasksView();