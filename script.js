// =========================================
// GET DOM ELEMENTS
// =========================================

// Top section
const userName = document.getElementById("userName");
const plusAddApplicationBtn = document.getElementById("plusAddApplicationBtn");
const signOutBtn = document.getElementById("signOutBtn");

// Search section
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Form
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

// Containers
const bottomWillhide = document.getElementById("bottom-will-hide");
const displayList = document.getElementById("displayList");

// Status counters
const totalCount = document.getElementById("count");
const rejCount = document.getElementById("rej-count");
const intCount = document.getElementById("int-count");
const otherCount = document.getElementById("other-count");

// Search results container
const searchResultsContainer = document.createElement("ul");
searchResultsContainer.id = "searchResultsList";                          
searchResultsContainer.style.display = "none";
document.getElementById("bottomm").appendChild(searchResultsContainer);


// Contact form
const contactBtn = document.getElementById("contactBtn");
const contactForm = document.getElementById("contactForm");
const name = document.getElementById("name");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const messageMe = document.getElementById("messageMe");
const submitMsg = document.getElementById("submitMsg");

// =========================================
// STORAGE
// =========================================
let data = [];          // Manual/applied jobs
let apiResults = [];    // API search results
let editIndex = null;   // For editing manual jobs
let contactStorage = [] // For contact form

// Load manual applications from localStorage
const savedData = localStorage.getItem("applications");
if (savedData) {
    data = JSON.parse(savedData);
    renderList();
}

// =========================================
// FORM VALIDATION
// =========================================
function formValidation() {
    if (compName.value.trim() === ""){ 
        alert("Please enter company name"); 
        return false; 
    }
    if (position.value.trim() === ""){ 
        alert("Please enter position"); 
        return false; 
    }
    if (date.value.trim() === ""){ 
        alert("Please select date");
         return false; 
        }
    return true;
}

// =========================================
// RENDER MANUAL APPLICATIONS
// =========================================
function renderList() {
    displayList.innerHTML = "";
    if (data.length === 0) {
        bottomWillhide.style.display = "block";
    } else {
        bottomWillhide.style.display = "none";
    }

    data.forEach((item, index) => {
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

        li.querySelector(".edit-btn").addEventListener("click", function(){
            loadFormForEdit(index);
        });

        li.querySelector(".delete-btn").addEventListener("click", function(){
            deleteApplication(index);
        });

        displayList.appendChild(li);
    });

    // Status counts
    totalCount.textContent = data.length;
    rejCount.textContent = data.filter(job => job.status === "Rejected").length;
    intCount.textContent = data.filter(job => job.status === "Interview").length;
    otherCount.textContent = data.filter(job => job.status === "Other").length;
}

// =========================================
// ADD or EDIT / UPDATE APPLICATION (data)
// =========================================
function formDataStoring() {
    if(!formValidation()){
        return;     
    }

    const formData = {
        company: compName.value.trim(),
        position: position.value.trim(),
        type: jobType.value,
        status: jobStatus.value,
        date: date.value,
        resume: resume.value.trim(),
        notes: message.value.trim(),
        rejectionReason: jobStatus.value === "Rejected" ? rejectionReason.value.trim() : ""
    };

    if (editIndex !== null) {
        data[editIndex] = formData;
        editIndex = null;
    } else {
        data.push(formData);
    }

    localStorage.setItem("applications", JSON.stringify(data));
    form.reset();
    form.style.display = "none";
    renderList();
}

// =========================================
// LOAD FORM FOR EDITING
// =========================================
function loadFormForEdit(index) {
    const item = data[index];
    compName.value = item.company;
    position.value = item.position;
    jobType.value = item.type;
    jobStatus.value = item.status;
    date.value = item.date;
    resume.value = item.resume;
    message.value = item.notes;
    rejectionContainer.style.display = item.status === "Rejected" ? "block" : "none";
    rejectionReason.value = item.rejectionReason || "";

    editIndex = index;
    addApplicationBtn.textContent = "Update Application";
    form.style.display = "block";
}

// =========================================
// DELETE APPLICATION
// =========================================
function deleteApplication(index) {
    data.splice(index, 1);
    localStorage.setItem("applications", JSON.stringify(data));
    renderList();
}

// =========================================
// API SEARCH (function)
// =========================================
async function searchJobs(query) {
    // Show "Please wait..." before starting the fetch
    searchResultsContainer.style.display = "block";
    displayList.style.display = "none";
    searchResultsContainer.innerHTML = "<li>Loading, please wait...</li>";

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=us&date_posted=all`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f545056ed1msh6b323ae063a13e4p1f0e6bjsn766ed6d040a1',
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!result.data || result.data.length === 0) {
            searchResultsContainer.innerHTML = "<li>No jobs found.</li>";
            return;
        }

        apiResults = result.data;
        renderSearchResults();  // Will replace the "Please wait..." message
    } catch (error) {
        console.error("Fetch error:", error);
        searchResultsContainer.innerHTML = "<li>No jobs found.</li>";
    }
}
// =========================================
// RENDER API SEARCH RESULTS
// =========================================
function renderSearchResults() {
    displayList.style.display = "none";
    searchResultsContainer.style.display = "block";
    searchResultsContainer.innerHTML = "";

    apiResults.forEach((job) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${job.employer_name || "Unknown Company"}</strong><br>
            <strong>${job.job_title || "Unknown Position"}</strong><br>
            ${job.job_city || "Location not specified"}<br>
            <button class="apply-btn">Apply</button>
        `;


        //Apply button event listener
        li.querySelector(".apply-btn").addEventListener("click", function(){
            openApplyForm(job);
        })
        searchResultsContainer.appendChild(li);
    });
}

// =========================================
// OPEN FORM TO APPLY API JOB
// =========================================
function openApplyForm(job) {
    // Pre-fill the form with API data
    compName.value = job.employer_name || "";
    position.value = job.job_title || "";
    jobType.value = job.job_employment_type || "Full-time";
    jobStatus.value = "Applied";
    date.value = "";  // User must select
    resume.value = "";
    message.value = job.job_city ? `Location: ${job.job_city}` : "";
    rejectionContainer.style.display = "none";

    editIndex = null; // New entry
    addApplicationBtn.textContent = "Apply";
    form.style.display = "block";

    // Switch back to manual dashboard on submit
    displayList.style.display = "block";
    searchResultsContainer.style.display = "none";
}



// =========================================
// CONTACT FORM
// =========================================

// Validate contact form (function)

function validateContactForm(){
    if(name.value.trim() === ""){
        return false;
    }

    if(email.value.trim() === ""){
        return false;
    }

    if(subject.value.trim() === ""){
        return false;
    }

    if(messageMe.value.trim() === ""){
        return false;
    }

   // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email.value.trim())){
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}



// Store contact form inputs (function)
function contactFormDataStoring(){

    //Check if form is filled
if(!validateContactForm()){
    alert("Please fill out all the fields");
    return false;
}

const contactFormInfo = {
    name: name.value.trim(),
    email: email.value.trim(),
    subject: subject.value.trim(),
    message: messageMe.value.trim()
}

contactStorage.push(contactFormInfo)

return true;

}



// =========================================
// EVENT LISTENERS
// =========================================
plusAddApplicationBtn.addEventListener("click", () => form.style.display = "block");

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    form.reset();
    form.style.display = "none";
    editIndex = null;
});

addApplicationBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formDataStoring();
});

jobStatus.addEventListener("change", () => {
    rejectionContainer.style.display = jobStatus.value === "Rejected" ? "block" : "none";
});

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query === "") { alert("Please enter a job to search"); return; }
    searchJobs(query);
});

contactBtn.addEventListener("click", function(){
    contactForm.style.display = "block";
    contactBtn.style.display = "none";

})

submitMsg.addEventListener("click", function(e){
    e.preventDefault()
    const success = contactFormDataStoring()
    
    if(success){
        contactForm.reset()
        contactForm.style.display = "none"
    }
    
    window.location.reload();
})