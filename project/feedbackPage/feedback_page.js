/**
 * Submission constructor function.
 * @constructor
 * @param {string} name - The name of the submitter.
 * @param {string} email - The email of the submitter.
 * @param {string} feedback - The feedback provided by the submitter.
 * @param {string} satisfaction - The satisfaction level chosen by the submitter.
 */
function Submission(name, email, feedback, satisfaction) {
    this.name = name;
    this.email = email;
    this.feedback = feedback;
    this.satisfaction = satisfaction;
    var date = new Date();
    var sDate = date.toLocaleString();
    this.date = sDate;
}

// Global array to store the submissions
var submissions = [];

/**
 * Function to handle submission.
 */
function makeSubmission() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var feedback = document.getElementById("feedback").value;

    if (!name || !email || !feedback) {
        alert("Please fill all required fields.");
        return false;
    }

    // Get the selected satisfaction level
    var satLevelElements = document.querySelectorAll('input[type="radio"]:checked');
    var satLevels = Array.from(satLevelElements).map(function(radio) {
        return radio.value;
    });

    // Create Submission Object
    var submission = new Submission(name, email, feedback, satLevels);
    
    // Log the submission object
    console.log("Submission: ", submission); 

    // Store the submission in the global submissions array
    submissions.push(submission);
}

function canelSubmission() {
    window.open("../homePage/home_page.html");
}