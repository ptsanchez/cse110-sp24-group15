function validateForm(log_title, log_time, log_contributors, log_description) {
    if (!log_title || !log_time || !log_contributors || !log_description) {
        alert("Please fill in all fields.");
        return false;
    } else {
        return true;
    }
}

function makeSubmission() {
    let log_title = document.getElementById("log-title").value;
    let log_time = document.getElementById("log-time").value;
    let log_contributors = document.getElementById("log-contributor").value;
    let log_description = document.getElementById("log-description").value;

    if (validateForm(log_title, log_time, log_contributors, log_description)) {
        let proj_data = JSON.parse(localStorage.getItem("project_data"));
        let current_project = proj_data["current_project"];
        let projects = proj_data["project_data"][current_project];
        let logs = projects["logs"];

        if (!Array.isArray(logs)) {
            logs = Object.values(logs);
        }
        let curr_date = proj_data["current_date"].split("/");
        let new_log = {
            data: log_description,
            time: log_time,
            Month: curr_date[0],
            day: curr_date[1],
            Year: curr_date[2],
            title: log_title,
            contributors: log_contributors,
        };
        logs.push(new_log);

        projects["logs"] = logs;
        proj_data["project_data"][current_project] = projects;
        localStorage.setItem("project_data", JSON.stringify(proj_data));

        window.location.href = "../dayPage/day_page.html";
    }
}

function cancelSubmission() {
    window.location.href = "../dayPage/day_page.html";
}

window.onload = function () {
    // Get the current time
    let now = new Date();
    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");

    // Format the current time in HH:MM format
    let currentTime = `${hours}:${minutes}`;

    // Set the value of the time input to the current time
    document.getElementById("log-time").value = currentTime;
};
