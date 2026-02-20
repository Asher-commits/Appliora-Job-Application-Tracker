const addApplicationBtn = document.getElementById("add-btn");
const form = document.getElementById("form");
const companyName = document.getElementById("comp-name");
const jobTitle = document.getElementById("job-title");
const jobTypeSelect = document.getElementById("jobType");
const jobApplicationStatus = document.getElementById("status");
const calendar = document.getElementById("calendar");
const resume = document.getElementById("resume");
const formCancelBtn = document.getElementById("form-cancel-button");
const saveAppBtn = document.getElementById("save-app-btn");
const totalApplications = document.getElementById("total-apps");
const pending = document.getElementById("pending");
const interviews = document.getElementById("interviews");
const rejected = document.getElementById("rejected");

const displayApplication = document.getElementById("applications");

const addedApplications = document.getElementById("added-application");

const userNotes = document.getElementById("user-notes");

// Create storage to save applications
let applications = [];




// Validate form
function validateForm(){
    if(companyName.value === ""){
        alert("Please enter company name applied to")
        return false;
    }
    if(jobTitle.value === ""){
        alert("Please enter job title")
        return false;
    }
    if(jobTypeSelect.value === ""){
        alert("Please select job type")
        return false;
    }
    if(jobApplicationStatus.value === ""){
        alert("Please select application status")
        return false;
    }
    if(calendar.value === ""){
        alert("Please select a date ")
        return false;
    }
    if(resume.value === ""){
        alert("Please upload a resume")
        return false;
    }
    return true; // form is valid
}






//Handle add application button
saveAppBtn.addEventListener("click", function(event){
    event.preventDefault(); //stops form submission

//Stop if invalid
    if(!validateForm()){
        return;
    }

// Create application object
const applicationData = {
    company: companyName.value,
    title: jobTitle.value,
    type: jobTypeSelect.value,
    status: jobApplicationStatus.value,
    date: calendar.value,
    resume: resume.value
}

//store applicaiton
applications.push(applicationData);

//Update total application count
function updateTotalApplications(){
    totalApplications.textContent = `Total Applications ${applications.length}`;
}

//Update UI Count
updateTotalApplications()


//Create li to show added application
const li = document.createElement("li");
let liContent = `
<h2>Recent Applications</h2>
  <i class="fa-duotone fa-solid fa-briefcase"></i> 
  <strong>${applicationData.company}</strong><br>
  ${applicationData.title}<br>
  Type: ${applicationData.type}<br>
  Status: ${applicationData.status}<br>
  Date: ${applicationData.date}<br>
  Resume: ${applicationData.resume}<br>
`;

if(userNotes.value.trim() !== ""){
    liContent += `<strong>Notes:</strong> ${userNotes.value}<br>`;
}


li.innerHTML = liContent

//Append to ul
addedApplications.appendChild(li);


//clear form
form.reset();

//Remove empty application footer
displayApplication.style.display = "none"

});






