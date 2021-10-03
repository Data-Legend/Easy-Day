
export let state = {
    todayDate:{},
    toDoList:[],
    moviesList:[],
    booksList:[],
    archive:[],
}
// ==============Helpers====================
const done = function () {
    const audio = new Audio('../src/audio/done.mp3');
    audio.play();
}
// =========================================
export const addTask = function(input , priority){
    const thisDay = new Date().toString().split(" ").splice(1,3).join(" "); // 'Sep 24 2021'
    const task = {task:input ,priority:priority,done:false,due:'Today',added: thisDay};
    state.toDoList.push(task);
    rearrangeTasks();
    saveData();
}

const rearrangeTasks = function(){
    if(state.toDoList.length<2) return;
    const highTasks = state.toDoList.filter(el=> el.priority === 'HIGH');
    const midTasks = state.toDoList.filter(el=> el.priority === 'MID');
    const easyTasks = state.toDoList.filter(el=> el.priority === 'Easy');
    const arr = [];
    arr.push(...highTasks,...midTasks,...easyTasks);
    state.toDoList = arr;
}

export const taskDone = function(name){
   const  taskIndex = state.toDoList.findIndex(el => el.task === name);
   const check = state.toDoList[taskIndex].done ;
   if(!check) {state.toDoList[taskIndex].done = true; done();}
   else state.toDoList[taskIndex].done = false;
   saveData();
}
const getDate = function () {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   const todayObj = new Date(); //today-date object
    //it will return date in lovely form like>>> Sep 23, 2021 
   const dateForm =  todayObj.toString().split(" ").splice(1,3).map((val,i)=> i===1?`${val},`:val).join(" "); 
   const today = days[todayObj.getDay()]; //will return full today Name
   state.todayDate = {dayName:today, date:dateForm, dayObj: todayObj};
}

const dailyTasksUpdate = function(){
    if(!state) return;
 const rightNow = new Date().toString().split(" ").splice(1,3).join(" "); // Today=> 'Sep 24 2021' 
 state.toDoList.forEach(task=> { //checking every task
 if (task.added !== rightNow){ //if last time task changed isn't today so Re-Finish it
      task.done = false; 
      task.added = rightNow;  //update task last time
 }
 });
 saveData();
 console.log(state.toDoList);
}

export const addMovie = function(movie){
    const thisDay = new Date().toString().split(" ").splice(1,3).join(" "); // 'Sep 24 2021'
    const movieObj = {movie:movie,added:thisDay,watched:false,}
    state.moviesList.push(movieObj);
    rearrangeMovies();
    saveData();
}
export const removeMovie = function(movie){
    const index = state.moviesList.findIndex(m=> m.movie === movie);
    state.archive.push(state.moviesList[index]);
    state.moviesList.splice(index,1);
    saveData();
}
export const checkMovie = function (name){
    const  movieIndex = state.moviesList.findIndex(el => el.movie === name);
    const check = state.moviesList[movieIndex].watched ;
    if(!check){ state.moviesList[movieIndex].watched = true; done(); }
    else state.moviesList[movieIndex].watched = false;
    rearrangeMovies();
    saveData();
}
export const archiveTask = function(tName){
    const index = state.toDoList.findIndex(t=> t.task === tName);
    state.archive.push(state.toDoList[index]);
    state.toDoList.splice(index,1);
    console.log(state);
    saveData();
}
const rearrangeMovies = function(){
    if (state.moviesList.length < 2) return;
    const watched = state.moviesList.filter(el => el.watched === true);
    const nonWatched = state.moviesList.filter(el => el.watched === false);
    const arr = [];
    arr.push(...nonWatched , ...watched);
    state.moviesList = arr;

}
export const addBook = function(book){
   const thisDay = new Date().toString().split(" ").splice(1,3).join(" "); // 'Sep 24 2021'
   const bookObj = {book:book,added:thisDay,read:false,}
   state.booksList.push(bookObj);
   saveData();
}
export const removeBook = function(book){
    const index = state.booksList.findIndex(b=> b.book === book);
    state.archive.push(state.booksList[index]);
    state.booksList.splice(index,1);
    saveData();
}

export const IsBookRead = function (book) {
    const  bookIndex = state.booksList.findIndex(el => el.book === book);
    const check = state.booksList[bookIndex].read ;
    if(!check){ state.booksList[bookIndex].read = true; done(); }
    else state.booksList[bookIndex].read = false;
    saveData();
}
export const saveData = function(){
    localStorage.setItem('state',JSON.stringify(state));
}
const getData = function(){
    const data =localStorage.getItem('state');
    if(!data) return;
    console.log(JSON.parse(data));
    state = JSON.parse(data);
}
export const deleteItem = function(item){
    const itemIndex = state.archive.findIndex( el=> el[Object.keys(el)[0]] = item);
    console.log(itemIndex);
   state.archive.splice(itemIndex,1);
   saveData();
}
const init = function () {
    getData();
    getDate(); 
    dailyTasksUpdate();
}
init();