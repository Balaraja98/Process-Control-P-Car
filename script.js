/* ===========================
   INDEXED DB SETUP
=========================== */

let db;

const request = indexedDB.open("EmployeeDB", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;

  db.createObjectStore("employees", {
    keyPath: "id",
    autoIncrement: true
  });

  console.log("Database Created");
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("Database Ready");
  renderTable();
};

request.onerror = function () {
  console.log("DB Error");
};


/* ===========================
   DOM
=========================== */

const empTable = document.getElementById("empTable");
const empModal = document.getElementById("empModal");
const viewModal = document.getElementById("viewModal");

const empIndex = document.getElementById("empIndex");
const empId = document.getElementById("empId").value;
const nameInp = document.getElementById("name").value;
const roleInp = document.getElementById("role").value;
const contractInp = document.getElementById("contract").value;
const expInp = document.getElementById("experience").value;
const skillsInp = document.getElementById("skills").value;
const passInp = document.getElementById("passvalid").value;
const busInp = document.getElementById("busroute").value;
const locInp = document.getElementById("location").value;
const photoInp = document.getElementById("photo").value;

const viewPhoto = document.getElementById("viewPhoto");
const viewName = document.getElementById("viewName");


/* ===========================
   TABLE LOAD
=========================== */

function renderTable() {
  empTable.innerHTML = "";

  const tx = db.transaction("employees", "readonly");
  const store = tx.objectStore("employees");

  const getAll = store.getAll();

  getAll.onsuccess = function () {
    const employees = getAll.result;

    employees.forEach((e) => {
      empTable.innerHTML += `
        <tr>
          <td>${e.empId}</td>
          <td>${e.name}</td>
          <td>${e.role}</td>
          <td>${e.contract}</td>
          <td>${e.experience}</td>
          <td>${e.skills}</td>
          <td>${e.passvalid}</td>
          <td>${e.busroute}</td>
          <td>${e.location}</td>
          <td>
          <span onclick="viewEmployee(${e.id})">View</span> |
            <span onclick="editEmployee(${e.id})">Edit</span> |
            <span class="delete-btn" onclick="deleteEmployee(${e.id})">Delete</span> 
            
          </td>
        </tr>`;
    });
  };
}


/* ===========================
   SAVE
=========================== */

function saveEmployee() {

  let data = {
    empId: empId.value,
    name: nameInp.value,
    role: roleInp.value,
    contract: contractInp.value,
    experience: expInp.value,
    skills: skillsInp.value,
    passvalid: passInp.value,
    busroute: busInp.value,
    location: locInp.value,
    photo: ""
  };

  const file = photoInp.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      data.photo = reader.result;
      saveToDB(data);
    };
    reader.readAsDataURL(file);
  } else {
    saveToDB(data);
  }
}

function saveToDB(data) {
  const tx = db.transaction("employees", "readwrite");
  const store = tx.objectStore("employees");

  store.add(data);

  tx.oncomplete = function () {
    renderTable();
    closeModal();
  };
}


/* ===========================
   DELETE
=========================== */

function deleteEmployee(id) {
  if (confirm("Delete employee?")) {
    const tx = db.transaction("employees", "readwrite");
    const store = tx.objectStore("employees");

    store.delete(id);

    tx.oncomplete = function () {
      renderTable();
    };
  }
}


/* ===========================
   EDIT
=========================== */

function editEmployee(id) {

  const tx = db.transaction("employees", "readonly");
  const store = tx.objectStore("employees");

  const request = store.get(id);

  request.onsuccess = function () {
    const e = request.result;

    empIndex.value = e.id;
    empId.value = e.empId;
    nameInp.value = e.name;
    roleInp.value = e.role;
    contractInp.value = e.contract;
    expInp.value = e.experience;
    skillsInp.value = e.skills;
    passInp.value = e.passvalid;
    busInp.value = e.busroute;
    locInp.value = e.location;

    openModal();
  };
}


/* ===========================
   UPDATE
=========================== */

function updateEmployee() {

  const id = Number(empIndex.value);

  const tx = db.transaction("employees", "readwrite");
  const store = tx.objectStore("employees");

  const request = store.get(id);

  request.onsuccess = function () {

    let data = request.result;

    data.empId = empId.value;
    data.name = nameInp.value;
    data.role = roleInp.value;
    data.contract = contractInp.value;
    data.experience = expInp.value;
    data.skills = skillsInp.value;
    data.passvalid = passInp.value;
    data.busroute = busInp.value;
    data.location = locInp.value;

    store.put(data);

    tx.oncomplete = function () {
      renderTable();
      closeModal();
    };
  };
}


/* ===========================
   VIEW
=========================== */

function viewEmployee(id) {

  const tx = db.transaction("employees", "readonly");
  const store = tx.objectStore("employees");

  const request = store.get(id);

  request.onsuccess = function () {

    const e = request.result;

    viewPhoto.src = e.photo || "image.jpg";
    viewName.innerText = e.name;

    document.getElementById("viewEmpId").innerText = e.empId;
    document.getElementById("viewRole").innerText = e.role;
    document.getElementById("viewContract").innerText = e.contract;
    document.getElementById("viewExperience").innerText = e.experience;
    document.getElementById("viewSkills").innerText = e.skills;
    document.getElementById("viewPass").innerText = e.passvalid;
    document.getElementById("viewBus").innerText = e.busroute;
    document.getElementById("viewLocation").innerText = e.location;

    viewModal.style.display = "flex";
  };
}


/* ===========================
   MODAL & CLEAR
=========================== */

function openModal() {
  empModal.style.display = "flex";
}

function closeModal() {
  empModal.style.display = "none";
  clearForm();
}

function closeView() {
  viewModal.style.display = "none";
}

function clearForm() {
  empIndex.value = "";
  empId.value = "";
  nameInp.value = "";
  roleInp.value = "";
  contractInp.value = "";
  expInp.value = "";
  skillsInp.value = "";
  passInp.value = "";
  busInp.value = "";
  locInp.value = "";
  photoInp.value = "";
}