import * as model from './model.js';
import dateView from './view/dateView.js'
import tasksView from './view/tasksView.js';
import menuView from './view/menuView.js';
import moviesView from './view/moviesView.js';
import archiveView from './view/archiveView.js';
import booksView from './view/booksView.js';
// =====================================================
const controlDate = function(){
    dateView.render(model.state.todayDate)
}
const controlTasksLis = function(){
tasksView.render(model.state.toDoList);
}

const controlAddTask  = function(input , priority){
    model.addTask(input , priority);
    tasksView.render(model.state.toDoList);
}
const controlTaskDone = function(tName){
    model.taskDone(tName);
    tasksView.render(model.state.toDoList);
}
const controlTaskArchive = function(tName){
    model.archiveTask(tName);
    tasksView.render(model.state.toDoList);
}
const DailyTasks = function(){
    controlDate();
    controlTasksLis();
    tasksView.addTaskHandler(controlAddTask );
    tasksView.addTaskDoneHandler(controlTaskDone);
    tasksView.removeTaskDoneHandler(controlTaskArchive);
}
const controlMenu = function(){
    menuView.render(true);

}
const movieListReactivate = function(){
    moviesView.render(model.state.moviesList);
    moviesView.addMovieHandler(controlAddMovie);
    moviesView.removeMovieHandler(removeMovie);
    moviesView.movieWatched(checkMovie)
}
const checkMovie = function(movie){
 model.checkMovie(movie);
 movieListReactivate();
}
const controlAddMovie = function(movie){
    model.addMovie(movie);
    movieListReactivate();
}
const removeMovie = function(movie){
model.removeMovie(movie);
movieListReactivate();
}
// ============= books section=====================
const controlAddBook = function(book){
    model.addBook(book);
    booksListReactivate();
    }
const contreolRemoveBook = function(book){
    model.removeBook(book);
    booksListReactivate();
    } 
const  controlIsBookRead = function (book) {
    model.IsBookRead(book);
    booksListReactivate();
} 
const booksListReactivate = function(){
        booksView.render(model.state.booksList);  
        booksView.addbookHandler(controlAddBook); 
        booksView.removebookHandler(contreolRemoveBook);
        booksView.bookRead(controlIsBookRead);
    }
// ================Archive=========================
const controlClearArchive = function () {
    model.state.archive = [];
    model.saveData();
    ArchiveReactivate();
}
const controlDleteHandler = function(item){
 model.deleteItem(item);
 ArchiveReactivate();
}
const ArchiveReactivate = function () {
    archiveView.render(model.state.archive);
    archiveView.clearArchiveHandler(controlClearArchive);
    archiveView.removeItem(controlDleteHandler);
}
// ==================================================
const menuClickHandler = function(id){
    console.log(id);
if( id === 'movies'){
    movieListReactivate();
}
if(id === 'dailyTasks'){
location.reload();
}
if(id === 'archive'){
    ArchiveReactivate();
}

if(id === 'booksList'){
    booksListReactivate();
}
}
const init = function(){
    DailyTasks();
    controlMenu();
    menuView.menuHandler(menuClickHandler);
}
init();

