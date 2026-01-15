let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskContainer = document.getElementById("taskContainer");
const completedContainer = document.getElementById("completedContainer");


/************************************/
document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    dateInput.value = `${day}-${month}-${year}`;
  }
});
// ================= SHOW TASKS =================
function renderTasks(list) {
  taskContainer.innerHTML = "";
  list.forEach((task, index) => {
    if (!task.completed) {
      taskContainer.innerHTML += taskCard(task, index, true, true, true);
    }
  });
}


if (taskContainer) {
  renderTasks(tasks);
}

if (completedContainer) {
  completedContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    if (task.completed) {
      completedContainer.innerHTML += taskCard(task, index, false, true, true);
    }
  });
}

// ================= TASK CARD =================
// function taskCard(task, index, showBtn = false, showDelete = true) {
//   return `
//   <div class="card">
//     <p><b>Date:</b> ${task.date || "-"}</p>
//     <p><b>Order No:</b> ${task.order || "-"}</p>
//     <p><b>Name:</b> ${task.name || "-"}</p>     
//     <p><b>Address:</b> ${task.address || "-"}</p>
//     <p><b>Phone:</b> ${task.phone || "-"}</p>
//     <p><b>Email:</b> ${task.email || "-"}</p>
//     <p><b>Order Description:</b> ${task.additional || "-"}</p>

//     ${showBtn ? `<button onclick="confirmComplete(${index})">Mark as Complete</button>` : ""}
//     ${showDelete ? `<button class="delete" onclick="deleteTask(${index})">Delete</button>` : ""}
//   </div>`;
  
// }

function taskCard(task, index) {
  const isCompletedPage = document.getElementById("completedContainer");

  return `
  <div class="card">
    <p><b>Date:</b> ${task.date || "-"}</p>
    <p><b>Order No:</b> ${task.order || "-"}</p>
    <p><b>Name:</b> ${task.name || "-"}</p>
    <p><b>Address:</b> ${task.address || "-"}</p>
    <p><b>Phone:</b> ${task.phone || "-"}</p>
    <p><b>Email:</b> ${task.email || "-"}</p>
    <p><b>Order Details:</b> ${task.additional || "-"}</p>

    <div class="card-buttons">
      ${
        !task.completed
          ? `<button class="complete" onclick="confirmComplete(${index})">Mark as Complete</button>`
          : ""
      }

      ${
        !isCompletedPage
          ? `<button class="edit" onclick="editTask(${index})">Edit</button>`
          : ""
      }

      <button class="delete" onclick="deleteTask(${index})">Delete</button>
    </div>
  </div>`;
}


function deleteTask(index) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (confirmDelete) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    location.reload();
  }
}


// ================= ADD TASK =================
function addTask() {
  const taskName = document.getElementById("name").value.trim();
  const taskDate = document.getElementById("date").value;
  const taskAddress = document.getElementById("address").value.trim();
  const taskPhone = document.getElementById("phone").value.trim();
  const taskEmail = document.getElementById("email").value.trim();
  const taskAdditional = document.getElementById("additional").value.trim();
  const editIndex = document.getElementById("editIndex").value;

  if (!taskName) {
    alert("Name is required");
    return;
  }

  if (editIndex !== "") {
    // ===== UPDATE EXISTING TASK =====
    tasks[editIndex].name = taskName;
    tasks[editIndex].date = taskDate;
    tasks[editIndex].address = taskAddress;
    tasks[editIndex].phone = taskPhone;
    tasks[editIndex].email = taskEmail;
    tasks[editIndex].additional = taskAdditional;

    document.getElementById("editIndex").value = ""; // reset
  } else {
    // ===== ADD NEW TASK =====
    const task = {
      date: taskDate,
      order: generateOrderNumber(),
      name: taskName,
      address: taskAddress,
      phone: taskPhone,
      email: taskEmail,
      additional: taskAdditional,
      completed: false
    };
    tasks.push(task);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  location.reload();
}




// ================= CONFIRM POPUP =================
function confirmComplete(index) {
  const confirmBox = confirm("Are you sure you want to mark this task as complete?");
  if (confirmBox) {
    tasks[index].completed = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    location.reload();
  }
}

function renderFilteredTasks(list) {
  taskContainer.innerHTML = "";

  list.forEach(item => {
    taskContainer.innerHTML += taskCard(item.task, item.index, true, true);
  });
}


// ================= FILTER LOGIC =================
function applyFilter() {
  const fName = document.getElementById("filterName").value
    .toLowerCase()
    .trim();

  const fDate = document.getElementById("filterDate").value;
  const fAddress = document.getElementById("filterAddress").value
    .toLowerCase()
    .trim();

  taskContainer.innerHTML = "";

  tasks.forEach((task, index) => {
    if (task.completed) return;

    const taskName = (task.name || "").toLowerCase().trim();
    const taskAddress = (task.address || "").toLowerCase().trim();

    const nameMatch = fName === "" || taskName.includes(fName);
    const dateMatch = fDate === "" || task.date === fDate;
    const addressMatch = fAddress === "" || taskAddress.includes(fAddress);

    if (nameMatch && dateMatch && addressMatch) {
      taskContainer.innerHTML += taskCard(task, index, true, true);
    }
  });
}





function generateOrderNumber() {
  const year = new Date().getFullYear();
  let counterData = JSON.parse(localStorage.getItem("orderCounter")) || {};

  // Agar year change ho gaya
  if (counterData.year !== year) {
    counterData = { year: year, count: 1 };
  }

  const orderNumber = `BBI-${year}-${String(counterData.count).padStart(5, "0")}`;

  counterData.count++;
  localStorage.setItem("orderCounter", JSON.stringify(counterData));

  return orderNumber;
}
function clearFilter() {
  document.getElementById("filterDate").value = "";
  document.getElementById("filterName").value = "";
  document.getElementById("filterAddress").value = "";

  renderTasks(tasks); // saare in-process tasks show
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById("name").value = task.name;
  document.getElementById("date").value = task.date;
  document.getElementById("address").value = task.address;
  document.getElementById("phone").value = task.phone;
  document.getElementById("email").value = task.email;
  document.getElementById("additional").value = task.additional;
  document.getElementById("editIndex").value = index;

  window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to form
}

function taskCard(task, index) {
  return `
  <div class="card">
    <p><b>Date:</b> ${task.date || "-"}</p>
    <p><b>Order No:</b> ${task.order || "-"}</p>
    <p><b>Name:</b> ${task.name || "-"}</p>
    <p><b>Address:</b> ${task.address || "-"}</p>
    <p><b>Phone:</b> ${task.phone || "-"}</p>
    <p><b>Email:</b> ${task.email || "-"}</p>
    <p><b>Additional:</b> ${task.additional || "-"}</p>

    <div class="card-buttons">
      ${!task.completed ? `<button class="complete" onclick="confirmComplete(${index})">Mark as Complete</button>` : ""}
      <button class="edit" onclick="editTask(${index})">Edit</button>
      <button class="delete" onclick="deleteTask(${index})">Delete</button>
    </div>
  </div>`;
}


/*********** PAGE PASSWORD PROTECTION ***********/
const PAGE_PASSWORD = "904589"; // 👉 yahan apna password set karo

function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    const userPass = prompt("🔐 Enter Password to access this page:");

    if (userPass === PAGE_PASSWORD) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("❌ Wrong Password");
      document.body.innerHTML = ""; // page blank
    }
  }
}

checkAuth();
/************************************************/
function logout() {
  localStorage.removeItem("isLoggedIn");
  location.reload();
}




