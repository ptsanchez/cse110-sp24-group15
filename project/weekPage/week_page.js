// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);
// Run the init() function when the page has loaded
function init() {
    calendarScript();
}
// toggles tab from weekly to monthly view
function switchTab() {
    const tabs = document.querySelectorAll('.toggle');
    const all_content = document.querySelectorAll('.tabs__content');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
            // add/remove active tag to week/month
            tabs.forEach(tab => { tab.classList.remove('active') });
            tab.classList.add('active');

            // moves the line under active tab
            var line = document.querySelector('.week__month__line');
            line.style.width = e.target.offsetWidth + "px";
            line.style.left = e.target.offsetLeft + "px";

            // add/remove active tag from the content of the tab
            all_content.forEach(content => { content.classList.remove('active') });
            all_content[index].classList.add('active');
        })
    })
}

// redirect page to add_log_page.html when button is clicked
function redirectToAddLogPage() {
    window.location.href = "../addLogPage/add_log_page.html";
}


function calendarScript() {
    const weekDisplay = document.getElementById('week-display');
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');

    let currentDate = new Date();
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
    // format for calendar widget
    function formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
    // format to give to localstorage
    function formatDateToMMDDYYYY(date) {
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }
    // updates calendar
    function updateCalendar() {
        const weekDates = getWeekDates(new Date(currentDate));
        weekDisplay.textContent = `Week of ${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`;
        document.querySelectorAll('.day-column').forEach((column, index) => {
            column.innerHTML = `<div class="date-display">${formatDate(weekDates[index])}</div>`;
            column.dataset.date = weekDates[index].toISOString().split('T')[0];
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
            // console.log(formattedDate);
            window.location.href = "../dayPage/day_page.html";
        });
    });

    // Initialize calendar
    updateCalendar();
}


