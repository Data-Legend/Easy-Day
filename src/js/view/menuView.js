import view from "./view.js"

class menuView extends view{
    _parentEl = document.querySelector('.options_list');

    htmlGenerator(){
        let markup = `
        <ul>
        <li id ='dailyTasks' class='selected-li' ><span><i class="fas fa-tasks"></i></span><p>Daily Tasks</p></li>
        <!-- <li id ='furureTasks' ><span><i class="fas fa-chalkboard"></i></span> <p>Future Tasks</p></li>  -->
        <li id ='movies' ><span><i class="fas fa-play"></i></span> <p>Movies List</p></li>
        <li id ='booksList' ><span><i class="fas fa-book-reader"></i></span> <p>Books List</p></li>
        <li id ='archive' ><span><i class="fas fa-archive"></i></span> <p>Archive</p></li>
      </ul>
        `
        return markup;
    }

   menuHandler(handler){  //handle menu click
   this._parentEl.addEventListener('click',function(e){
       const li = e.target.closest('li');  //closest parent Li to the clicked target ...
       if(!li) return //if isn't an li parent return *User didn't clicked li*
       const ul = e.target.closest('ul'); //parent ul elemnt to loop through it
       const liArr = [...ul.getElementsByTagName('li')];  //array conatins all li itmes of that ul
       liArr.forEach(li => li.classList.remove('selected-li')); //delete backgroud effect of all items
       li.classList.add('selected-li');  //add that effect to the clicked li only
      handler(li.id);
   });
    }

}

export default new menuView();