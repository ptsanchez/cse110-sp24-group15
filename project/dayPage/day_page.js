window.addEventListener("DOMContentLoaded", init);

function init() {
    calendarScript();
}

function switchWeekly() {
    window.location.href = escape("../weekPage/week_page.html");
}

function switchMonthly() {
    window.location.href = escape("../monthPage/month_page.html");
}

function redirectToAddLogPage() {
    let proj_data = JSON.parse(localStorage.getItem("project_data"));
    let current_date = localStorage.getItem("current_date");
    proj_data["current_date"] = current_date;
    localStorage.setItem("project_data", JSON.stringify(proj_data));
    window.location.href = escape("../addLogPage/add_log_page.html");
}

module.exports = {switchWeekly, switchMonthly, redirectToAddLogPage};

function calendarScript() {
    const dayDisplay = document.getElementById('day-display');
    const prevDayBtn = document.getElementById('prev-day-btn');
    const nextDayBtn = document.getElementById('next-day-btn');

    let currentDate = new Date();
    const selectedDate = localStorage.getItem('current_date');
    if (selectedDate != null) {
        currentDate = new Date(selectedDate);
    }
    localStorage.setItem("current_date", formatDateToMMDDYYYY(currentDate));

    function formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    function formatDateToMMDDYYYY(date) {
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }

    function getProgressValue(projectName, index, currDate) {
        return localStorage.getItem(`progress-value-${projectName}-${index}-${currDate}`);
    }

    function updateProgressValue(projectName, index, value, currDate) {
        localStorage.setItem(`progress-value-${projectName}-${index}-${currDate}`, value);
    }

    function getDayOfWeek(date) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = date.getDay();
        return daysOfWeek[dayIndex];
    }

    function updateCalendar() {
        const thisDate = currentDate;
        dayDisplay.textContent = `${getDayOfWeek(thisDate)}, ${formatDate(thisDate)}`;
    }

    function updateEvents() {
        let jsonString = localStorage.getItem('project_data');
        let logs = [];
        if (jsonString) {
            let jsonObject = JSON.parse(jsonString);
            const currentProject = jsonObject.current_project;
            logs = jsonObject.project_data[currentProject].logs || [];
        }

        let currentDateStr = localStorage.getItem('current_date');
        let currentDate = new Date(currentDateStr);
        let current_logs = [];

        let month = currentDate.getMonth() + 1; // Months are zero-based
        let day = currentDate.getDate();
        let year = currentDate.getFullYear();

        logs.forEach(log => {
            if (parseInt(log.Month) == month && parseInt(log.day) == day && parseInt(log.Year) == year) {
                current_logs.push(log);
            }
        });

        localStorage.setItem("current_day_data", JSON.stringify(current_logs));
    }

    function updatePage() {
        let jsonString = localStorage.getItem('current_day_data');
        let jsonObject = JSON.parse(jsonString);
        const dayCalendarTitle = document.getElementById('day-calendar-title');
        const dayCalendarTime = document.getElementById('day-calendar-time');
        const dayCalendarProgress = document.getElementById('day-calendar-progress');
        const dayCalendarDescription = document.getElementById('day-calendar-description');

        // Clear existing content
        dayCalendarTitle.innerHTML = "Title";
        dayCalendarTime.innerHTML = "Time";
        dayCalendarDescription.innerHTML = "Description";
        dayCalendarProgress.innerHTML = "Progress";

        let currDate = localStorage.getItem('current_date');
        let projectDataString = localStorage.getItem('project_data');
        let projectData = JSON.parse(projectDataString);
        let currentProject = projectData.current_project;

        if (jsonObject && jsonObject.length > 0) {
            jsonObject.forEach((log, index) => {
                let titleDiv = document.createElement('div');
                titleDiv.textContent = log.title;
                titleDiv.classList.add("title");
                

                let timeDiv = document.createElement('div');
                timeDiv.textContent = log.time;
                timeDiv.classList.add("time");
                

                let descriptionDiv = document.createElement('div');
                descriptionDiv.textContent = log.data;
                descriptionDiv.classList.add("description");

                console.log(descriptionDiv.style)
                console.log(titleDiv.style.height)

                if (descriptionDiv.style.height > titleDiv.style.height){
                    let new_height = descriptionDiv.style.height;

                    titleDiv.style.height = new_height;
                    timeDiv.style.height = new_height;
                } else {
                    let new_height = titleDiv.style.height;

                    descriptionDiv.style.height = new_height;
                    timeDiv.style.height = new_height;
                }


                dayCalendarTitle.appendChild(titleDiv);
                dayCalendarTime.appendChild(timeDiv);
                dayCalendarDescription.appendChild(descriptionDiv);



                let progressContainer = document.createElement('div');
                progressContainer.classList.add('progress-container');

                let progressBarContainer = document.createElement('div');
                progressBarContainer.classList.add('progress-bar');

                let progressBar = document.createElement('div');
                progressBar.classList.add('progress');
                progressBar.id = `progress-bar-${currentProject}-${index}-${currDate}`;

                let inputRange = document.createElement('input');
                inputRange.type = 'range';
                inputRange.min = '0';
                inputRange.max = '100';
                inputRange.value = '50';
                inputRange.id = `progress-input-${currentProject}-${index}-${currDate}`;
                inputRange.addEventListener('input', function () {
                    let progressBarId = `progress-bar-${currentProject}-${index}-${currDate}`;
                    let progressBar = document.getElementById(progressBarId);
                    if (progressBar) {
                        progressBar.style.width = `${this.value}%`;
                        updateProgressValue(currentProject, index, this.value, currDate);
                    }
                });

                let progressValue = getProgressValue(currentProject, index, currDate) || '50';
                inputRange.value = progressValue;
                progressBar.style.width = `${progressValue}%`;

                progressBarContainer.appendChild(progressBar);
                progressContainer.appendChild(progressBarContainer);
                progressContainer.appendChild(inputRange);
                dayCalendarProgress.appendChild(progressContainer);
            });
        }
    }

    prevDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        localStorage.setItem("current_date", formatDateToMMDDYYYY(currentDate));
        updateCalendar();
        updateEvents();
        updatePage();
    });

    nextDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        localStorage.setItem("current_date", formatDateToMMDDYYYY(currentDate));
        updateCalendar();
        updateEvents();
        updatePage();
    });

    // Initialize calendar
    updateCalendar();
    updateEvents(); // Call updateEvents to ensure events are loaded initially
    updatePage();
}
