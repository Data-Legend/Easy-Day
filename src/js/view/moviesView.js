import view from "./view.js";

class moviesView extends view{
    _parentEl = document.querySelector('.container');
    _data;
    // {movie:'The wolf of wall street',added:'sep 14 2020',watched:false,}
    htmlGenerator(){
     return `${this.headerGen()} ${this.listGen()}`;
    }
    headerGen(){
      let markup = ` 
       <div class="addMovie">
        <form class="movie-form" action="">
          <img src="./src/imgs/netflix-logo.png" alt="">
           <input autofocus id="movieInput" type="text" name="newMovie" placeholder="Add a new movie or series...">
          <button class="add-movie" type="submit">Add</button>
        </form>
       </div>
          `
      document.querySelector('.parenContainer').style.backgroundImage = "url('../src/imgs/movie.jpg')";
      return markup;
    }
    listGen(){
        let markup = `
        <div class="movies">${this.checkList()}</div>
        `
        return markup;
    }
    addMovieHandler(handler){
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

    removeMovieHandler(handler){
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
    movieWatched(handler){
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
        <div class="item-name"><img src="./src/imgs/HBO-icon.png" alt=""><span>Name</span></div><p>Archive</p> <p class="due">Added</p>
         </div>
         <div class="movies-list">
         <ul class="today-s-list">
         ${this._data.map(el => `
         <li data-name='${el.movie}'>
         <i class="fas check-task ${el.watched?'checked-icon fa-check-square':'fa-square'}"></i>
       <p class='${el.watched?'task-done':''}'>${el.movie}</p>
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
      <div class="no-tasks">
      <img src="./src/imgs/uGotMe.gif" alt="404-Gif">
      <div>
        <h2>Your list is empty ;(</h2>
        <p>Add a new lovely movie...</p>
      </div>
    </div>     
      `;}
      return html;
    }

}

export default new moviesView();