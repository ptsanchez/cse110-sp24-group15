// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);
// Run the init() function when the page has loaded
function init() {
    calendarScript();
}
function switchWeekly() {
    window.location.href = "/../project/dummyWeekPage/week.html";
}
function switchMonthly() {
    window.location.href = "/../project/dummyMonthPage/month.html";
}
function redirectToAddLogPage() {
    window.location.href = "/../project/dummyAddPage/add.html";
}


function calendarScript() {
    const dayDisplay = document.getElementById('day-display');
    const prevWeekBtn = document.getElementById('prevDayBtn');
    const nextWeekBtn = document.getElementById('nextDayBtn');

    let currentDate = new Date();
    const selectedDate = localStorage.getItem("current_date");
    if (selectedDate) {
        // Parse the selected date string to a Date object
        currentDate = new Date(selectedDate);
    }
    
    // format for calendar widget
    function formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    function getDayOfWeek(date) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = date.getDay();
        return daysOfWeek[dayIndex];
    }
    // updates calendar
    function updateCalendar() {
        const thisDate = currentDate;
        dayDisplay.textContent = `${getDayOfWeek(thisDate)},  ${formatDate(thisDate)}`;
    }

    prevDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateCalendar();
    });

    // Event listener for the "Next Week" button
    nextDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateCalendar();
    });

    // Initialize calendar
    updateCalendar();
}