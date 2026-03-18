import View from "./view.js";

class ArchiveView extends View {
  _parentEl = document.querySelector('#appContainer');
  _data;

  htmlGenerator() {
    return `<div class="archive-section">${this.listGen()}</div>`;
  }

  listGen() {
    return `<div class="archive-content">${this.checkList()}</div>`;
  }

  removeItem(handler) {
    const list = this._parentEl.querySelector('.items-list');
    if (!list) return;
    list.addEventListener('click', function (e) {
      const span = e.target.closest('.remove-item');
      if (!span) return;
      const li = e.target.closest('li');
      if (li) {
        li.classList.add('disappear');
        setTimeout(() => handler(li.dataset.name), 500);
      }
    });
  }

  clearArchiveHandler(handler) {
    const clearBtn = this._parentEl.querySelector('.clear-archive');
    if (!clearBtn) return;
    clearBtn.addEventListener('click', function () {
      handler();
    });
  }

  checkList() {
    if (this._data.length > 0) {
      return `
            <div class="tasks-header" style="margin-top: 16px;">
                <p>Delete</p> <p class="due">Added</p>
            </div>
            <div class="items-list" style="margin-top: 8px;">
                <ul class="today-s-list">
                    ${this._data.map(el => {
        if (!el) return '';
        const key = Object.keys(el)[0];
        const name = el[key];
        const icon = key === 'task' ? 'fa-tasks' : key === 'book' ? 'fa-book' : 'fa-archive';
        return `
                        <li data-name="${this.escapeHtml(String(name))}">
                            <i class="fas ${icon}" style="color: var(--text-muted); margin-right: 12px; font-size: 16px;"></i>
                            <p>${this.escapeHtml(String(name))}</p>
                            <span class="remove-item"><i class="fas fa-trash"></i></span>
                            <div>
                                <span>${el.added ? this.escapeHtml(el.added) : ''}</span>
                            </div>
                        </li>
                        `;
      }).join('')}
                </ul>
            </div>
            <button class="clear-archive">
                <span>Clear archive</span>
                <i class="fas fa-trash-alt"></i>
            </button>
            `;
    }
    return `
        <div class="empty-state">
            <div class="empty-state__icon"><i class="fas fa-archive"></i></div>
            <h2>Archive is empty</h2>
            <p>Archived tasks and books will appear here.</p>
        </div>
        `;
  }
}

export default new ArchiveView();