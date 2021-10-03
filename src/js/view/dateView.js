import view from "./view.js";
class dateView extends view{
    _parentEl = document.querySelector('.header');
    htmlGenerator(){
      const markup = `
      <div> <img src="./src/imgs/Calendar-icon.png" alt=""><h2>${this._data.dayName}</h2></div>
    <p>${this._data.date}</p>
    `;
    return markup ;
    }
}
export default new dateView();
