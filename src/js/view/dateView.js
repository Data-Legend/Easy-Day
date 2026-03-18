import View from "./view.js";

class DateView extends View {
  _parentEl = document.querySelector('.header');

  htmlGenerator() {
    const markup = `
        <div>
            <img src="./src/imgs/Calendar-icon.png" alt="Calendar">
            <h1>${this.escapeHtml(this._data.dayName)}</h1>
        </div>
        <p>${this.escapeHtml(this._data.date)}</p>
        `;
    return markup;
  }
}

export default new DateView();
