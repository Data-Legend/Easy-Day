import view from "./view.js";
class tasksView extends view{
    _parentEl =  document.querySelector('.tasks');
    // _parentEl = document.querySelector('.today-s-list');
    _form = document.querySelector('.new-task-form');
    htmlGenerator(){
    const liMarkup= this._data.map(task =>{
        return `
        <li data-name = '${task.task}'><i class="fas ${task.done?'checked-icon fa-check-square':'fa-square'} check-task"></i>
        <p class='${task.done?'task-done':''}'>${task.task}</p>
        <span class="remove-item" ><i class="fas fa-trash" ></i></span>
        <div>
          <span>${task.due}</span>
          <span class = '${task.priority === 'Easy' ?'easy' :''}${task.priority === 'HIGH' ?'hard' :''}'>${task.priority}</span>
        </div>
      </li>
        `
    }).join("");
    let header = this.checkTasks();
    let markup = `${header}<div class="tasks-list"><ul class="today-s-list">${liMarkup}</ul></div>`
    return markup
    }
    checkTasks(){
      let header;
      if(this._data.length < 1) { header = `<div class="no-tasks">
      <img src="./src/imgs/earth404.gif" alt="404-Gif">
      <div>
        <h2>Your to-Do's is empty ;(</h2>
        <p>Add new tasks to your daily list...</p>
      </div>
    </div>` }
    else header = `
    <div class="tasks-header">
    <p>Archive</p> <p class="due" >DUE</p><p>PRIORITY</p>
    </div>
    `;
    return header;
    }
    addTaskHandler(handler){
        this._form.addEventListener('submit',function(e){
            e.preventDefault();
            const input = document.querySelector('#taskInput');
            const priority = document.querySelector('#priority');
            const inputVal = input.value;
            if(inputVal.length < 1) return;
            const priorityVal = priority.value ;
            input.value = ''; //clearing input field ;)
            handler(inputVal , priorityVal);
        });
    }

    addTaskDoneHandler(handler){
      this._parentEl.addEventListener('click', function(e){
      if(!e.target.classList.value.includes('check-task')) return;
      const li = e.target.closest('li');
      if(li) handler(li.dataset.name);
    });
    }
    
    removeTaskDoneHandler(handler){
      this._parentEl.addEventListener('click', function(e){
        const span = e.target.closest('.remove-item');
        if(!span) return; //if the click out icon
        if(!span.classList.value.includes('remove-item')) return; //verify that was on remove span <i>
        const li = e.target.closest('li');
        if(li){
          li.classList.add('disappear');   //adding disappear animation
          setTimeout(()=>handler(li.dataset.name),1000);  //remove task from model state 
        };
      });
    }
}
export default new tasksView();