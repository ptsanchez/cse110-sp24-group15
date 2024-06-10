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

function calendarScript() {
    const weekDisplay = document.getElementById('week-display');
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');

    let currentDate = new Date();
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format


    // gets the dates for the current week being looked at
    function getWeekDates(date) {
        const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() - 6));

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

    function updateEvents() {
        let jsonString = localStorage.getItem('project_data');
        let logs = []

        if (jsonString) {
            let jsonObject = JSON.parse(jsonString);
            let currentProject = jsonObject.current_project;
            logs = jsonObject.project_data[String(currentProject)].logs || [];
        }

        console.log(logs)

        let current_logs = {};

        for(let log of logs){
            let day = parseInt(log.day, 10).toString();
            let month = parseInt(log.Month, 10).toString();

            // Add leading zero if day or month is a single digit
            if (parseInt(log.day, 10) < 10) {
                day = '0' + day;
            }
            if (parseInt(log.Month, 10) < 10) {
                month = '0' + month;
            }

            let date = `${log.Year}-${month}-${day}`;

            if (!( date in current_logs)){
                current_logs[String(date)] = [];
            }

            current_logs[String(date)].push(log)
        };

        localStorage.setItem("all_logs", JSON.stringify(current_logs));
    }


    function updateCalendar() {
        const weekDates = getWeekDates(new Date(currentDate));
        weekDisplay.textContent = `Week of ${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`;

        let jsonString = localStorage.getItem('all_logs');
        let jsonObject = JSON.parse(jsonString);



        document.querySelectorAll('.day-column').forEach((column, index) => {
            column.innerHTML = '';
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

            const monthMapping = {
                'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
                'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
            };

            let dateBreakdown = String(weekDates[Number(index)]).split(' ');
            let dateString = `${dateBreakdown[3]}-${monthMapping[String(dateBreakdown[1])]}-${dateBreakdown[2]}`;
            let logs = jsonObject[String(dateString)] || [];

            logs.sort((a, b) => a.time.localeCompare(b.time));

            let titleDiv = document.createElement('div');
            titleDiv.classList.add("space-buffer");
            column.appendChild(titleDiv);
            
            for(let log of logs){
                let titleDiv = document.createElement('div');
                titleDiv.textContent = log.title;
                titleDiv.classList.add("log-title");

                column.appendChild(titleDiv);
            };

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
            let date_split = clicked_date.split("-");
            let year = parseInt(date_split[0], 10);
            let month = parseInt(date_split[1], 10) - 1;
            let day = parseInt(date_split[2], 10);
            let date = new Date(year, month, day);
            date.setDate(date.getDate() - 1);
            let formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
            localStorage.setItem("current_date", formattedDate);
            window.location.href = escape("../dayPage/day_page.html");
        });
    });

    // Initialize calendar
    updateEvents()
    updateCalendar();
}

if (typeof module === 'object' && module.exports) {
    module.exports = {switchWeekly, switchMonthly, redirectToAddLogPage};
}
