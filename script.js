/* made by mabawonku joshua */

/* This is the srcipt for a to-do app, it's built basically on the HTML DOM, ES6, LocalStorage WebAPI and critical intelligence( joshua's brain )*/
/* 
    it consists of functions to add tasks, remove tasks, save tasks, search for tasks, modify task's objective
    it main use is to use it as a way to understand the DOM while standing out as a better programmer witha better to-do app in pure javascript
*/



// the data strcutures used in this program
/* 
    the Task constructor is used to create new task object( tasks ),
    the tasks array is used to store tasks when retrieving from the localstorage,
    the swap object is used to facilitte swapping the order of tasks in the list
    the savedTasks variable is used to periodically hold a json string which is made from the tasks array
    ... it's used to save this converted json string to the localStorage for restoration
*/
class Task {
    constructor( text, index ) {
        this.text = text,
        this.index = index
    }
}
// restore saved tasks from the browser's storage if available else create some default tasks
var tasks = ( localStorage.getItem("to-do") == null ) ? [ { text: "do task", index: 0 }, { text: "using the task app", index: 1 } ] : JSON.parse( localStorage.getItem("to-do") );
var savedTasks;

// save the tasks every 3 seconds
setInterval( function(){
    savedTasks = JSON.stringify(tasks);
    localStorage.setItem("to-do", savedTasks);
}, 3000);




// the variables used in this program and their declarations
var taskDiv, taskText, deleteIcon, checkedIcon, icon, element, task, text;
var taskIndex = 0;
var checkedIcons = document.getElementsByClassName("checkIcon"), deleteIcons = document.getElementsByClassName("deleteIcon");
var taskElements = document.getElementsByClassName("taskDiv"), taskAddInput = document.getElementById("taskAddInput");
var taskCheckUrgent = document.getElementById("taskCheckUrgent"), taskAddButton = document.getElementById("taskAddButton");
var cancelButtons = document.getElementsByClassName("cancelBtn");
var searchInput = document.getElementById("searchInput"), searchButton = document.getElementById("searchBtn");
var searchResultsBox = document.getElementById("searchResultsBox"), tasksBox = document.getElementById("taskBox");

var searchBtn = document.getElementById("search"), addBtn = document.getElementById("add");
var showTaskTab = document.getElementById("showTasks"), searchTaskTab = document.getElementById("searchTasks");
var addTaskTab = document.getElementById("addTasks");


// primary events and handling
searchBtn.addEventListener("click", function(){
    addTaskTab.style.display = "none";
    searchTaskTab.style.display = "block";
});
addBtn.addEventListener("click", function(){
    searchTaskTab.style.display = "none";
    addTaskTab.style.display = "block";
});
cancelButtons[0].addEventListener("click", showTheTaskTab);
cancelButtons[1].addEventListener("click", showTheTaskTab);


function showTheTaskTab(){
    searchTaskTab.style.display = "none";
    addTaskTab.style.display = "none";
    if ( searchResultsBox.children.length != 0 ) {
        searchResultsBox.removeChild( searchResultsBox.children[0] );
    }
};

function attachEventListeners(){
    //attaching event handlers to remove or delete tasks
    for ( icon of checkedIcons ) {
        icon.addEventListener("click", removeTask);
    }
    for ( icon of deleteIcons ) {
        icon.addEventListener("click", removeTask);
    }

    // attaching event handlers to allow modification of tasks
    for ( element of taskElements ) {
        element.addEventListener("dblclick", modifyTask);
    }
}



// the showTasks function -> this is used to display all the tasks in the tasksArray above
function showTasks(){
    for ( task of tasks ) {
        // create all neccessary items for this corresponding task in the DOM
        taskDiv =  document.createElement("div");
        text = document.createTextNode( task.text );
        taskText = document.createElement("span");
        deleteIcon = document.createElement("span");
        checkedIcon = document.createElement("span");
    
        // set styles to the elements created using pre-defined class names in the css stylesheets
        deleteIcon.setAttribute( "class", "deleteIcon fas fa-trash");
        checkedIcon.setAttribute( "class", "checkIcon fas fa-check-circle");
        taskText.setAttribute( "class", "taskText");
        taskDiv.setAttribute( "class", "taskDiv");
    
        // set special attributes to the taskDiv elements created( used in task manipulation )
        taskDiv.setAttribute( "data-index", task.index );
    
        // append elements to their parents
        taskText.appendChild(text);
        taskDiv.appendChild(taskText);
        taskDiv.appendChild(deleteIcon);
        taskDiv.appendChild(checkedIcon);
        tasksBox.appendChild(taskDiv);
    }
}
// show the tasks
showTasks();
// attach event listeners to allow manipulation of tasks
attachEventListeners();



/* 
    the following functions are used to update the indexes of the tasks if any task manipulation takes place
    in the taskArray or on the webpage
*/
function updateTaskIndexesOfObjectsInTasks(){
    //update the value of the index property in each object in the tasksArray
    for ( task of tasks ){
        task.index = taskIndex;
        taskIndex++ ;
    }

    //update the value of taskIndex to it's initial value for the next function call
    taskIndex = 0;
}
function updateTaskIndexesOfTasksDiv(){
    //update the value of the index property in each object in the tasksArray
    for ( element of taskElements ){
        element.setAttribute("data-index", taskIndex);
        taskIndex++ ;
    }

    //update the value of taskIndex to it's initial value for the next function call
    taskIndex = 0;
}



/* utility functions */



// the removeTask function -> this is used to set a task as done or deleted
function removeTask(){
    //get the index of the selected element
    var indexOfSelectedElement = this.parentNode.getAttribute("data-index");

    //remove the corresponding task object in the tasksArray
    tasks.splice( indexOfSelectedElement, 1 );

    //remove the corresponding element from the webpage
    tasksBox.removeChild( taskElements[ indexOfSelectedElement ] );

    //updating the indexes of the other objects and taskElements in the taskArray and webpage respectively
    updateTaskIndexesOfObjectsInTasks();
    updateTaskIndexesOfTasksDiv();
}




// the modifyTask function -> this is used to modify the objective of a task
function modifyTask(){
    // get the new objective
    var newTaskText = prompt("enter your new task objective");
    // get the index of the selected element
    var indexOfSelectedElement = this.getAttribute("data-index");

    // show the new objective
    taskElements[indexOfSelectedElement].children[0].innerHTML = newTaskText;
    
    // save the new task objective in the corresponding object in the taskArray
    tasks[indexOfSelectedElement].text = newTaskText;
}



// adding tasks
taskAddButton.addEventListener("click", function(){
    // variable declarations
    var lengthOfElements;

    // validate the input provided
    if ( taskAddInput.value === "" ) {
        alert("no task objective provided");
    } else {
        if ( taskCheckUrgent.checked === true ) {
            //create the new task object
            var newTask = new Task( taskAddInput.value, 0 );

            //add it to the tasksArray
            tasks.unshift(newTask);

            //update the indexes in the tasksArray
            updateTaskIndexesOfObjectsInTasks();

            //delete and re-display the tasks on the webpage
            for ( lengthOfElements = ( taskElements.length - 1 ); lengthOfElements >= 0; lengthOfElements-- ) {
                taskElements[lengthOfElements].parentNode.removeChild( taskElements[lengthOfElements] );
            }
            showTasks();

            // attach event listeners to allow manipulation of the re-displayed tasks
            attachEventListeners();

            //show the tasks
            showTheTaskTab();
        } else {
            //create the new task object
            var newTask = new Task( taskAddInput.value, 2 );

            //add it to the tasksArray
            tasks.push(newTask);

            //update the indexes in the tasksArray
            updateTaskIndexesOfObjectsInTasks();

            //delete and re-display the tasks on the webpage
            for ( lengthOfElements = ( taskElements.length - 1 ); lengthOfElements >= 0; lengthOfElements-- ) {
                taskElements[lengthOfElements].parentNode.removeChild( taskElements[lengthOfElements] );
            }
            showTasks();

            // attach event listeners to allow manipulation of the re-displayed tasks
            attachEventListeners();

            //show the tasks
            showTheTaskTab();
        }
    }
});



// search for tasks
searchButton.addEventListener("click", function(){
    if ( searchInput.value === "" ) {
        alert("no search value provided, try again");
    } else {
        searchTasks( searchInput.value );
    }
});

// the search tasks function to search for tasks
function searchTasks(value) {
    // variable declaration
    var correspondingElementIndex, found = false;

    for ( lengthOfElements = ( taskElements.length - 1 ); lengthOfElements >= 0; lengthOfElements-- ) {
            if ( taskElements[lengthOfElements].children[0].innerHTML == value ) {
                // get the index of the corresponding index
                correspondingElementIndex = taskElements[lengthOfElements].getAttribute("data-index");
    
                // set the found flag to true and stop the loop
                found = true;
                lengthOfElements = -1;
    
                // create an element with the corresponding data and display in the search result box
                taskDiv =  document.createElement("div");
                text = document.createTextNode( tasks[correspondingElementIndex].text);
                taskText = document.createElement("span");
                deleteIcon = document.createElement("span");
                checkedIcon = document.createElement("span");
                
                // set styles to the elements created using pre-defined class names in the css stylesheets
                deleteIcon.setAttribute( "class", "deleteIcon fas fa-trash");
                checkedIcon.setAttribute( "class", "checkIcon fas fa-check-circle");
                taskText.setAttribute( "class", "taskText");
                taskDiv.setAttribute( "class", "taskDiv");
                
                // set special attributes to the taskDiv elements created( used in task manipulation )
                taskDiv.setAttribute( "data-index", correspondingElementIndex );
                
                // append elements to their parents
                taskText.appendChild(text);
                taskDiv.appendChild(taskText);
                taskDiv.appendChild(deleteIcon);
                taskDiv.appendChild(checkedIcon);
                searchResultsBox.appendChild(taskDiv);

                // attach event listeners to the created element to allow manipulation
                taskDiv.addEventListener("dblclick", modifyTask);
                deleteIcon.addEventListener("click", removeTask);
                checkedIcon.addEventListener("click", removeTask);
            }
    }

    if ( found == false ) {
        alert("task not found, try again");
    }
}