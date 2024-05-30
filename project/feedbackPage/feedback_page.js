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

/**
 * Function to handle submission.
 */
function makeSubmission(event) {
    event.preventDefault(); // Prevent form submission

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

    // Retrieve existing submissions from localStorage
    var submissions = JSON.parse(localStorage.getItem('feedback_submissions')) || [];

    // Add the new submission to the array
    submissions.push(submission);

    // Save the updated submissions array back to localStorage
    localStorage.setItem('feedback_submissions', JSON.stringify(submissions));

    alert('Thank you for your feedback!');

    // Redirect to success page
    window.location.href = "../successPage/success_page.html";
}

/* stylelint-disable */
function cancelSubmission() {
    window.location.href = "../homePage/home_page.html";
}
/* stylelint-enable */



// Export functions for testing in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { makeSubmission };
}
