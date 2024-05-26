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

  // Validate the form inputs
  if (validateForm(log_title, log_time, log_contributors, log_description)) {
    // Parse the project data from localStorage
    let proj_data = JSON.parse(localStorage.getItem("project_data"));
    let current_project = proj_data["current_project"]; // Get the current project identifier
    let projects = proj_data["project_data"][current_project]; // Get the current project data
    let logs = projects["logs"]; // Get the logs array

    // If logs is not an array, convert it to an array
    if (!Array.isArray(logs)) {
      logs = Object.values(logs);
    }

    // Split the current date into an array of [Month, Day, Year]
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
    };

    // Add the new log entry to the logs array
    logs.push(new_log);

    // Update the projects object with the new logs array
    projects["logs"] = logs;

    // Update the project data in localStorage
    proj_data["project_data"][current_project] = projects;
    localStorage.setItem("project_data", JSON.stringify(proj_data));

    // Redirect the user to the day page
    window.location.href = "../dayPage/day_page.html";
  }
}

/**
 * Handles the cancellation of the form submission by redirecting to the day page.
 */
function cancelSubmission() {
  window.location.href = "../dayPage/day_page.html"; // Redirect to the day page
}

/**
 * Sets the default value of the time input to the current time when the page loads.
 */
window.onload = function () {
  // Get the current time
  let now = new Date();
  let hours = String(now.getHours()).padStart(2, "0"); // Get the hours and pad with leading zero if needed
  let minutes = String(now.getMinutes()).padStart(2, "0"); // Get the minutes and pad with leading zero if needed

  // Format the current time in HH:MM format
  let currentTime = `${hours}:${minutes}`;

  // Set the value of the time input to the current time
  document.getElementById("log-time").value = currentTime;
};
