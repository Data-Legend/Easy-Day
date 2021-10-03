import view from "./view.js";

class archiveView extends view{
    _parentEl = document.querySelector('.container');
    _data;
    htmlGenerator(){
      document.querySelector('.parenContainer').style.backgroundImage = "url('../src/imgs/archive-bg.jpg')";
     return `${this.headerGen()} ${this.listGen()}`;
    }
    headerGen(){
      let markup = ``
      return markup;
    }
    listGen(){
        let markup = `
        <div class="archive">${this.checkList()}</div>
        `
        return markup;
    }

    removeItem(handler){
      if(document.querySelector('.remove-item') === null) return;
        const ul = document.querySelector('.movies-list').querySelector('ul');
        ul.addEventListener('click',function(e){
            const span = e.target.closest('.remove-item');
            if(!span) return; //if the click out icon
            if(!span.classList.value.includes('remove-item')) return; //verify that was on remove span <i>
            const li = e.target.closest('li');
            if(li){
              li.classList.add('disappear');   //adding disappear animation
              setTimeout(()=>handler(li.dataset.name),1000);  //remove task from model state 
            };
        })
    }
    clearArchiveHandler(handler){
      if(document.querySelector('.clear-archive')=== null) return
      document.querySelector('.clear-archive').addEventListener('click',function(){
        handler();
      })
    }
    checkList(){
      let html;
      if(this._data.length > 0){
         html = `
         <div class="movies-list-header">
         <div class="item-name"><img src="./src/imgs/basket.png" alt=""><span>Name</span></div><p>Delete</p> <p class="due">Added</p>
          </div>
          <div class="movies-list">
            <ul class="today-s-list archive-list">
            ${this._data.map(el=> el !== null ? `
            <li data-name="${el[Object.keys(el)[0]]}">
            <img src="./src/imgs/${Object.keys(el)[0]}.png" alt="">
           <p class="">${el[Object.keys(el)[0]]}</p>
           <span class="remove-item"><i class="fas fa-trash"></i></span>
           <div>
             <span>${el.added}</span>
           </div>
         </li>
            `:'').join('')}
              </ul>
              <div class="clear-archive"><p>Clear archive</p><i class="fas fa-trash-alt"></i></div>
            </div></div>
       </div>
        `
      }
      else{ html = `
      <div class="no-tasks">
      <img src="./src/imgs/spider-web.png" alt="spider-web">
      <div>
        <h2>Your Archive is empty ;(</h2>
        <p>Error 404...</p>
      </div>
    </div>     
      `;}
      return html;
    }

}

export default new archiveView();