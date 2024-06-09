/**
 * Validates the form by checking if all required fields are filled.
 *
 * @param {string} log_title - The title of the log entry.
 * @param {string} log_time - The time of the log entry.
 * @param {string} log_contributors - The contributors to the log entry.
 * @param {string} log_description - The description of the log entry.
 * @returns {boolean} - Returns true if all fields are filled, otherwise false.
 */
function validateForm(log_title, log_time, log_contributors, log_description) {
  // Check if any of the fields are empty
  if (!log_title || !log_time || !log_contributors || !log_description) {
    // Alert the user to fill in all fields
    alert("Please fill in all fields.");
    return false; // Return false if validation fails
  } else {
    return true; // Return true if validation passes
  }
}

/**
 * Handles the submission of the form by creating a new log entry and saving it to localStorage.
 */

function makeSubmission() {
  // Get the values from the form inputs
  let log_title = document.getElementById("log-title").value;
  let log_time = document.getElementById("log-time").value;
  let log_contributors = document.getElementById("log-contributor").value;
  let log_description = document.getElementById("log-description").value;

  // Get the value from the CodeMirror editor
  let log_code_snippet = window.editor.getValue();

  // Validate the form inputs
  if (validateForm(log_title, log_time, log_contributors, log_description)) {
    // Parse the project data from localStorage
    let proj_data = JSON.parse(localStorage.getItem("project_data"));
    const current_project = proj_data["current_project"]; // Get the current project identifier
    let projects = proj_data["project_data"][String(current_project)]; // Get the current project data
    let logs = projects["logs"]; // Get the logs array

    // If logs is not an array, convert it to an array
    if (!Array.isArray(logs)) {
      logs = Object.values(logs);
    }

  let curr_date = proj_data["current_date"].split("/");

    // Create a new log entry
    let new_log = {
      data: log_description,
      time: log_time,
      Month: curr_date[0],
      day: curr_date[1],
      Year: curr_date[2],
      title: log_title,
      contributors: log_contributors,
      codeSnippet: log_code_snippet // Add the code snippet to the log entry
    };

    // Add the new log entry to the logs array
    logs.push(new_log);

    // Update the projects object with the new logs array
    projects["logs"] = logs;

    // Update the project data in localStorage
    proj_data["project_data"][String(current_project)] = projects;
    localStorage.setItem("project_data", JSON.stringify(proj_data));

    // Redirect the user to the day page after submission
    localStorage.setItem("current_date", curr_date)
    window.location.href = escape("../dayPage/day_page.html");
  }
}

/**
 * Handles the cancellation of the form submission by redirecting to the day page.
 */
function cancelSubmission() {
  window.location.href = escape("../dayPage/day_page.html"); // Redirect to the day page
}
if (typeof module === 'object' && module.exports) {
  module.exports = {validateForm, makeSubmission, cancelSubmission};
}