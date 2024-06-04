// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

function init() {
    calendarScript();
}

function switchWeekly() {
    window.location.href = escape("/../project/weekPage/week_page.html");
}

function switchMonthly() {
    window.location.href = escape("/../project/monthPage/month_page.html");
}

function redirectToAddLogPage() {
    window.location.href = escape("/../project/addLogPage/add_log_page.html");
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

    function getDayOfWeek(date) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = date.getDay();
        return daysOfWeek[dayIndex]
    }

    function updateCalendar() {
        const thisDate = currentDate;
        dayDisplay.textContent = `${getDayOfWeek(thisDate)}, ${formatDate(thisDate)}`;
    }

    function updateEvents() {
        let jsonString = localStorage.getItem('project_data');
        let logs;
        if (jsonString) {
            let jsonObject = JSON.parse(jsonString);
            logs = jsonObject.logs;
        } else {
            logs = [];
        }

        let currentDateStr = localStorage.getItem('current_date');
        let currentDate = new Date(currentDateStr);
        let current_logs = [];

        let month = currentDate.getMonth() + 1; // Months are zero-based
        let day = currentDate.getDate();
        let year = currentDate.getFullYear();

        logs.forEach(log => {
            if (log.Month == month && log.day == day && log.Year == year) {
                current_logs.push(log);
            }
        });

        localStorage.setItem("current_day_data", JSON.stringify(current_logs));
    }

    function updatePage(){
        let jsonString = localStorage.getItem('current_day_data');
        let jsonObject = JSON.parse(jsonString);
        const dayCalendarTitle = document.getElementById('DayCalendarTitle');
        const dayCalendarTime = document.getElementById('DayCalendarTime');

        // Clear previous events
        dayCalendarTitle.innerHTML = "Title";
        dayCalendarTime.innerHTML = "Time";

        // Display current logs
        jsonObject.forEach(log => {
            let titleDiv = document.createElement('div');
            titleDiv.textContent = log.title;
            dayCalendarTitle.appendChild(titleDiv);

            let timeDiv = document.createElement('div');
            timeDiv.textContent = log.time;
            dayCalendarTime.appendChild(timeDiv);
        });
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
