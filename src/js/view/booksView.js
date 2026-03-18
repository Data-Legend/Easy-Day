import View from "./view.js";

class BooksView extends View {
  _parentEl = document.querySelector('#appContainer');
  _data;

  htmlGenerator() {
    return `${this.headerGen()} ${this.listGen()}`;
  }

  headerGen() {
    return `
        <div class="books-section">
            <div class="add-form">
                <form class="add-item-form book-form" action="">
                    <span style="padding: 0 14px; font-size: 20px; color: var(--accent-success);">
                        <i class="fas fa-book"></i>
                    </span>
                    <input autofocus id="bookInput" type="text" name="newbook" placeholder="Add new book to your list..." maxlength="120">
                    <button type="submit"><i class="fas fa-plus"></i> <span>Add</span></button>
                </form>
            </div>
        `;
  }

  listGen() {
    return `<div class="items-section">${this.checkList()}</div></div>`;
  }

  addbookHandler(handler) {
    const form = this._parentEl.querySelector('.book-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const inputEl = form.querySelector('input');
      const inputVal = inputEl.value.trim();
      if (inputVal.length < 1) return;
      inputEl.value = '';
      handler(inputVal);
    });
  }

  removebookHandler(handler) {
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

  bookRead(handler) {
    const list = this._parentEl.querySelector('.items-list');
    if (!list) return;
    list.addEventListener('click', function (e) {
      if (!e.target.classList.contains('check-task') && !e.target.closest('.check-task')) return;
      const li = e.target.closest('li');
      if (li) handler(li.dataset.name);
    });
  }

  checkList() {
    if (this._data.length > 0) {
      return `
            <div class="tasks-header" style="margin-top: 16px;">
                <p>Archive</p> <p class="due">Added</p>
            </div>
            <div class="items-list" style="margin-top: 8px;">
                <ul class="today-s-list">
                    ${this._data.map(el => `
                    <li data-name="${this.escapeHtml(el.book)}">
                        <i class="fas check-task ${el.read ? 'checked-icon fa-check-square' : 'fa-square'}"></i>
                        <p class="${el.read ? 'task-done' : ''}">${this.escapeHtml(el.book)}</p>
                        <span class="remove-item"><i class="fas fa-trash"></i></span>
                        <div>
                            <span>${this.escapeHtml(el.added)}</span>
                        </div>
                    </li>
                    `).join("")}
                </ul>
            </div>
            `;
    }
    return `
        <div class="empty-state">
            <div class="empty-state__icon"><i class="fas fa-book-open"></i></div>
            <h2>No books yet</h2>
            <p>Start building your reading list!</p>
        </div>
        `;
  }
}

export default new BooksView();