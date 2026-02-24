// Getting all the HTML elements for DOM

//Top part
const userName = document.getElementById("userName");
const plusAddApplicationBtn = document.getElementById("plusAddApplicationBtn");
const signOutBtn = document.getElementById("signOutBtn");

//Form
const form = document.getElementById("form");
const compName = document.getElementById("compName");
const position = document.getElementById("position");
const jobType = document.getElementById("jobType");
const jobStatus = document.getElementById('jobStatus');
const date = document.getElementById("date");
const resume = document.getElementById("resume");
const message = document.getElementById("message");
const addApplicationBtn = document.getElementById("addApplicationBtn");
const cancelBtn = document.getElementById("cancelBtn");

const rejectionContainer = document.getElementById("rejectionContainer");
const rejectionReason = document.getElementById("rejectionReason");

//Middle part
const totalApplications = document.getElementById("totalApplications");
const pending = document.getElementById("pending");
const interviews = document.getElementById("interviews");
const rejected = document.getElementById("rejected");
const totalCount = document.getElementById("count")


//Bottom part
const bottomm = document.getElementById("bottomm");
const displayList = document.getElementById("displayList");
const bottomWillhide = document.getElementById("bottom-will-hide");


// Storage for form data
let data = [];
let editIndex = null;


//Form validation (function)------------

function formValidation(){

if(compName.value === ""){
    alert("Please enter company name");
    return false;
}

if(position.value === ""){
    alert("Please enter company position applying for");
    return false;
}

if(date.value === ""){
    alert("Please select date of apply")
    return false;
}
return true;

}

// ===============================
// Render List 
// ===============================

function renderList() {

    displayList.innerHTML = "";

    if (data.length === 0) {
        bottomWillhide.style.display = "block";
    } else {
        bottomWillhide.style.display = "none";
    }

    data.forEach(function(item, index) {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${item.company}</strong><br>
            <strong>${item.position}</strong><br>
            ${item.type} | ${item.status} | ${item.date}
            ${item.notes ? `<p><strong>Notes:</strong> ${item.notes}</p>` : ""}
            ${item.resume ? `<p><strong>Resume:</strong> ${item.resume}</p>` : ""}
            ${item.rejectionReason ? `<p><strong>Rejection Reason:</strong> ${item.rejectionReason}</p>` : ""}
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        // Edit application button
        const editBtn = li.querySelector(".edit-btn");
        editBtn.addEventListener("click", function() {
            loadFormForEdit(index);
        });

        // Delete button
        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function() {
            deleteApplication(index);
        });

        displayList.appendChild(li);
    });

    totalCount.textContent = data.length;
}


// ===============================
// Add / Update Application
// ===============================

function formDataStoring() {

    if (!formValidation()) return;


    const formData = {
        company: compName.value.trim(),
        position: position.value.trim(),
        type: jobType.value,
        status: jobStatus.value,
        date: date.value,
        resume: resume.value.trim(),
        notes: message.value.trim(),
        rejectionReason: jobStatus.value === "Rejected" 
        ? rejectionReason.value.trim() 
        : ""
    };
    

    // If editing
    if (editIndex !== null) {
        data[editIndex] = formData;
        editIndex = null;
    } 
    // If new
    else {
        data.push(formData);
    }

    renderList();

    form.reset();
    form.style.display = "none";
}


// ===============================
// Load Data Into Form (Edit Mode)
// ===============================

function loadFormForEdit(index) {

    const item = data[index];

    compName.value = item.company;
    position.value = item.position;
    jobType.value = item.type;
    jobStatus.value = item.status;
    date.value = item.date;
    resume.value = item.resume;
    message.value = item.notes;

    if (item.status === "Rejected") {
        rejectionContainer.style.display = "block";
        rejectionReason.value = item.rejectionReason;
    } else {
        rejectionContainer.style.display = "none";
        rejectionReason.value = "";
    }

    editIndex = index;
    
    //Change button text
    addApplicationBtn.textContent = "Update Application"

    form.style.display = "block";
}


// ===============================
// Delete Application
// ===============================

function deleteApplication(index) {

    data.splice(index, 1);

    renderList();
}


// ===============================
// Event Listeners
// ===============================

// Show form
plusAddApplicationBtn.addEventListener("click", function() {
    form.style.display = "block";
});

// Cancel form
cancelBtn.addEventListener("click", function(e) {
    e.preventDefault();
    form.reset();
    form.style.display = "none";
    editIndex = null;
});

// Submit form
addApplicationBtn.addEventListener("click", function(e) {
    e.preventDefault();
    formDataStoring();
});

//Rejection event listener
jobStatus.addEventListener("change", function() {

    if (jobStatus.value === "Rejected") {
        rejectionContainer.style.display = "block";
    } else {
        rejectionContainer.style.display = "none";
        rejectionReason.value = "";
    }

});