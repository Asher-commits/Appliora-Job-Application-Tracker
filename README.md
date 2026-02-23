# Job-Application-Tracker





//User clicks + add application button (event Listener)---------
plusAddApplicationBtn.addEventListener("click", function(){

//Unhide form
form.style.display ="block"
})

//user clicks cancel button within form and form will disappear (click event listener)-------------
cancelBtn.addEventListener("click", function(e){

 e.preventDefault();

//Hide form    
form.style.display = "none"
})


// Form data storing after user clicks add application button (function)------------

let count = 0

function formDataStoring(){

//Li to render form data at the bottom
const li = document.createElement("li");

//Check if user fillled out the form
    if(!formValidation()){
        return;
    }

//Store input fields
    let formData = {
        company: compName.value.trim(),
        position: position.value.trim(),
        type: jobType.value,
        status: jobStatus.value,
        date: date.value,
        resume: resume.value.trim(),
        notes: message.value.trim()

    }

//Total application count change
totalCount.textContent = data.length;

//Push data
data.push(formData);


//Organizing data to display at the bottom

//first hide the bottom part
bottomWillhide.style.display = "none"

//Now organize data
li.innerHTML = `<strong>${formData.company}</strong><br>
<strong>${formData.position}</strong><br>
${formData.type} | ${formData.status} | ${formData.date}
${formData.notes ? `<p><strong>Notes:</strong> ${formData.notes}</p>` : ""}

${formData.resume ? `<p><strong>Resume:</strong> ${formData.resume}</p>` : ""}
`

// Now render data
displayList.appendChild(li)

//Show buttons
editBtn.style.display = "inline";
deletebtn.style.display = "inline";

//Form reset
form.reset();
form.style.display = "none";

}

//when user clicks add application button inside form (click event listener)--------

addApplicationBtn.addEventListener("click", function(e){
    e.preventDefault();
    formDataStoring();
});


//Edit button inside form functionality (function)-------------
function editButton(edit){
    edit = formDataStoring;

}

// editBtn.addEventListener("click", function(e){
//     e.preventDefault();
//     formDataStoring();

// })







