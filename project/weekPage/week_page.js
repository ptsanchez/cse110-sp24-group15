// Run the init() function when the page has loaded
if(typeof(window) !== "undefined"){
    window.addEventListener("DOMContentLoaded", init);
}

function init() {
    calendarScript();
}

function switchWeekly() {
    window.location.href = escape("../weekPage/week_page.html");
}

function switchMonthly() {
    window.location.href = escape("../monthPage/month_page.html");
}

// redirect page to add_log_page.html when button is clicked
function redirectToAddLogPage() {
    window.location.href = escape("../addLogPage/add_log_page.html");
}

module.exports = {switchWeekly, switchMonthly, redirectToAddLogPage};

function calendarScript() {
    const weekDisplay = document.getElementById('week-display');
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');

    let currentDate = new Date();
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // gets the dates for the current week being looked at
    function getWeekDates(date) {
        const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1));
        const dates = [];
        for (let i = 0; i < 7; i++) {
            dates.push(new Date(startOfWeek));
            startOfWeek.setDate(startOfWeek.getDate() + 1);
        }
        return dates;
    }

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

    function updateCalendar() {
        const weekDates = getWeekDates(new Date(currentDate));
        weekDisplay.textContent = `Week of ${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`;
        document.querySelectorAll('.day-column').forEach((column, index) => {
            // Remove existing date displays to avoid overlap
            const existingDateDiv = column.querySelector('.date-display');
            if (existingDateDiv) {
                existingDateDiv.remove();
            }

            const dateDiv = document.createElement('div');
            dateDiv.classList.add('date-display');
            dateDiv.textContent = formatDate(weekDates[Number(index)]);
            // const date = formatDate(weekDates[Number(index)]);
            // dateDiv.appendChild(document.createTextNode(date));
            column.appendChild(dateDiv);
    
            const columnDate = weekDates[Number(index)].toISOString().split('T')[0];
            column.dataset.date = columnDate;
            // column.setAttribute('id', column.getAttribute('id').toUpperCase());

            // Add or remove 'current-day' class based on the date
            if (columnDate === today) {
                column.classList.add('current-day');
            } else {
                column.classList.remove('current-day');
            }
        });
    }

    // previous week button
    prevWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateCalendar();
    });

    // next week button
    nextWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateCalendar();
    });

    // action when a day is clicked
    document.querySelectorAll('.day-column').forEach(column => {
        column.addEventListener('click', (event) => {
            const clicked_date = event.currentTarget.dataset.date;
            const date = new Date(clicked_date);
            const formattedDate = formatDateToMMDDYYYY(date);
            localStorage.setItem("current_date", formattedDate);
            window.location.href = escape("../dayPage/day_page.html");

            // i may not have to send over local storage
            // just get to the correct day_page

        });
    });

    // Initialize calendar
    updateCalendar();
}