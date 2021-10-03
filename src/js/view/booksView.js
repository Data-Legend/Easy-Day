import view from "./view.js";

class booksView extends view{
    _parentEl = document.querySelector('.container');
    _data;
    // {book:'Angels and Demons',added:'sep 14 2020',read:false,}
    htmlGenerator(){
      document.querySelector('.parenContainer').style.backgroundImage = "url('../src/imgs/books-bg.jpg')";
     return `${this.headerGen()} ${this.listGen()}`;
    }
    headerGen(){
      let markup = `
      <div class="addMovie">
       <form class="movie-form book-form" action="">
         <img src="./src/imgs/book.png" alt="">
          <input autofocus id="bookInput" type="text" name="newbook" placeholder="Add new Book to your list...">
         <button class="add-movie" type="submit">Add</button>
       </form>
      </div>
          `
      return markup;
    }
    listGen(){
        let markup = `
        <div class="movies books">${this.checkList()}</div>
        `
        return markup;
    }
    addbookHandler(handler){
    const form = this._parentEl.querySelector('form');
    form.addEventListener('submit' , function(e){
        e.preventDefault();
        const inputEL = form.querySelector('input');
        const inputVal = inputEL.value;
        if(inputVal.length < 1) return
        inputEL.value = '';
        handler(inputVal);
    })
    }

    removebookHandler(handler){
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
    bookRead(handler){
      if(document.querySelector('.check-task') === null) return;
      document.querySelector('.movies-list').addEventListener('click',function(e){
        if(!e.target.classList.value.includes('check-task')) return;
        const li = e.target.closest('li');
        if(li) handler(li.dataset.name);
      })
    }
    checkList(){
      let html;
      if(this._data.length > 0){
         html = `
        <div class="movies-list-header">
        <div class="item-name"><img src="./src/imgs/book2.png" alt=""><span>Name</span></div><p>Archive</p> <p class="due">Added</p>
         </div>
         <div class="movies-list">
         <ul class="today-s-list">
         ${this._data.map(el => `
         <li data-name='${el.book}'>
         <i class="fas check-task ${el.read?'checked-icon fa-check-square':'fa-square'}"></i>
       <p class='${el.read?'task-done':''}'>${el.book}</p>
       <span class="remove-item"><i class="fas fa-trash"></i></span>
       <div>
         <span>${el.added}</span>
       </div>
     </li>
         `).join("")}
           </ul>
         </div></div>
        `
      }
      else{ html = `
      <div class="no-tasks no-books">
      <img src="./src/imgs/no-books.gif" alt="404-Gif">
      <div>
        <h2>Your list is empty ;(</h2>
        <p>Add new Books to your list...</p>
      </div>
    </div>     
      `;}
      return html;
    }

}

export default new booksView();