import View from "./view.js";

class MenuView extends View {
    _parentEl = document.querySelector('.sidebar__menu');

    htmlGenerator() {
        let markup = `
        <ul>
            <li id="dailyTasks" class="selected-li">
                <span><i class="fas fa-tasks"></i></span>
                <p>Daily Tasks</p>
            </li>
            <li id="booksList">
                <span><i class="fas fa-book-reader"></i></span>
                <p>Books List</p>
            </li>
            <li id="archive">
                <span><i class="fas fa-archive"></i></span>
                <p>Archive</p>
            </li>
        </ul>
        `;
        return markup;
    }

    menuHandler(handler) {
        this._parentEl.addEventListener('click', function (e) {
            const li = e.target.closest('li');
            if (!li) return;
            const ul = e.target.closest('ul');
            const liArr = [...ul.getElementsByTagName('li')];
            liArr.forEach(item => item.classList.remove('selected-li'));
            li.classList.add('selected-li');
            handler(li.id);
        });
    }
}

export default new MenuView();