const createBtn = document.getElementsByClassName("createBtn");
const addCardBtn = document.getElementsByClassName("taskInitiate__addBtn");
const taskList_container = document.getElementById("todo__container");
const taskCompleted_container = document.getElementById("completed__container");
const usernameInput = document.getElementById("user_name");
const todo_tasksList = document.getElementById("todo__tasks_list");
const completed_tasksList = document.getElementById("completed__tasks_list");

const tasks_arr = JSON.parse(localStorage.getItem("tasks_arr_data")) || [];
displayTasks();

// window.onload = function () {
//   displayDate();
//   var tasks_arr = JSON.parse(localStorage.getItem("tasks_arr_data")) || [];
// }

window.addEventListener("load", () => {
  displayDate();
});

for (let i = 0; i < createBtn.length; i++) {
  createBtn[i].addEventListener("click", showTextAreaDiv);
  addCardBtn[i].addEventListener("click", generateTask_data);
}

usernameInput.addEventListener("change", (event) => {
  localStorage.setItem("username", event.target.value);
});

const username = localStorage.getItem("username") || "";
usernameInput.value = username;

function displayDate() {
  let date = new Date();
  date = date.toString().split(" ");
  document.getElementById("todays_date").innerHTML =
    date[2] + " " + date[1] + ", " + date[3];
}

function showTextAreaDiv(event) {
  const taskInitiate_Div = event.target.nextElementSibling;
  taskInitiate_Div.classList.toggle("disp_none");
  taskInitiate_Div.children[0].focus(); // focus directly to text area so user can input
}

function generateTask_data(event) {
  event.target.parentNode.classList.toggle("disp_none");
  let isTaskCompleted = false; // we assume the task is already completed i.e not(pending)
  if (event.target.parentNode.parentNode === taskCompleted_container) {
    isTaskCompleted = true;
  }
  const cardTextInput = event.target.previousElementSibling;
  let cardText = cardTextInput.value;

  const inidividual_Task = {
    content: cardText,
    isCompleted: isTaskCompleted,
    createdTime: new Date().getTime(),
    timeStamp: formatTimestamp(),
  };

  tasks_arr.push(inidividual_Task);
  localStorage.setItem("tasks_arr_data", JSON.stringify(tasks_arr));
  cardTextInput.value = "";
  displayTasks();
}

function displayTasks() {
  todo_tasksList.innerHTML = "";
  completed_tasksList.innerHTML = "";

  tasks_arr.forEach((task) => {
    const card_container = document.createElement("div");
    card_container.classList.add("task__card");
    card_container.setAttribute("data-time", task.createdTime);

    const card_checkbox = document.createElement("input");
    card_checkbox.type = "checkbox";
    card_checkbox.classList.add("task__completed-check");
    card_container.appendChild(card_checkbox);
    if (task.isCompleted) {
      card_checkbox.checked = true;
    }

    // Task completed functionality
    card_checkbox.addEventListener("change", (event) => {
      const currCard = event.target.parentNode;
      if (event.target.checked) {
        completed_tasksList.insertBefore(currCard, completed_tasksList.children[0]); // arr.children[arr.length-1].appendChild(currCard);
        task.isCompleted = true;
      } 
      else {
        todo_tasksList.insertBefore(currCard, todo_tasksList.children[0]);
        task.isCompleted = false;
      }
      localStorage.setItem("tasks_arr_data", JSON.stringify(tasks_arr));
    });
    
    const details_container = document.createElement("div");
    const taskCreation_date = document.createElement("div");
    taskCreation_date.classList.add("task__creation_time");
    taskCreation_date.innerText = task.timeStamp;
    details_container.appendChild(taskCreation_date);

    const task_details = document.createElement("textarea");
    task_details.classList.add("subheader_text");
    task_details.classList.add("task_details");
    task_details.value = task.content;
    task_details.setAttribute("readonly", "readonly");
    details_container.appendChild(task_details);
    card_container.appendChild(details_container);

    const card__btns_container = document.createElement("div");
    card__btns_container.innerHTML = `
      <button onclick="deleteCard(this)" class="btn"><i class="fa-regular fa-trash-can"></i></button>
      <button onclick="editCard(this)" class="btn"><i class="fa-regular fa-pen-to-square"></i></button>
      `;
    card_container.appendChild(card__btns_container);

    if (task.isCompleted) {
      completed_tasksList.insertBefore(
        card_container,
        completed_tasksList.children[0]
      );
    } else {
      todo_tasksList.insertBefore(card_container, todo_tasksList.children[0]);
    }
  });
}

// display timestamp
function formatTimestamp() {
  // Get the current timestamp
  let currentDate = new Date();
  // Extract hours, minutes, and seconds
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  // Determine AM/PM
  let ampm = hours >= 12 ? 'PM' : 'AM';
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12' in 12-hour format

  // Add leading zero if necessary
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  // Create a formatted time string
  let formattedTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
  return formattedTime;
}

// delete Functionality
function deleteCard(btnRef) {
  let curTaskCardTime = btnRef.parentNode.parentNode.getAttribute("data-time");
  let deleteIndex = -1;
  tasks_arr.forEach((task, index)=>{
    if(task.createdTime === parseInt(curTaskCardTime)){
      // if matches , delete this element from tasks.arr array
      deleteIndex = index;
    }
  })
  if (deleteIndex !== -1) {
    tasks_arr.splice(deleteIndex, 1);
  }
  localStorage.setItem("tasks_arr_data", JSON.stringify(tasks_arr));
  btnRef.parentNode.parentNode.remove();

}

// edit Functionality

function editCard(btnRef) {
  let curTaskCardTime = btnRef.parentNode.parentNode.getAttribute("data-time");
  let currTaskDetailsArea = btnRef.parentNode.previousElementSibling.lastElementChild;
  if (btnRef.innerHTML === `<i class="fa-regular fa-pen-to-square"></i>`) {
    currTaskDetailsArea.removeAttribute("readonly");
    currTaskDetailsArea.focus();
    btnRef.innerHTML = `<i class="fa-regular fa-floppy-disk"></i>`;
  } 
  else
  {
    currTaskDetailsArea.setAttribute("readonly", "readonly");
    btnRef.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
    tasks_arr.forEach((task)=>{
      if(task.createdTime === parseInt(curTaskCardTime)){
        task.content = currTaskDetailsArea.value;
        localStorage.setItem("tasks_arr_data", JSON.stringify(tasks_arr));
      }
    })
  }

}
