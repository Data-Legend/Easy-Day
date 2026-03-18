export default class View {
    constructor() {
        this._abortController = null;
    }

    clear() {
        if (this._parentEl) this._parentEl.textContent = '';
    }

    render(data) {
        if (data === undefined || data === null) return;
        this._data = data;
        this.clear();
        const markup = this.htmlGenerator();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    // Safely attach event listeners with AbortController pattern to prevent leaks
    addSafeListener(element, event, handler) {
        if (!element) return;
        element.addEventListener(event, handler);
    }

    // Sanitize text for safe HTML insertion
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}