const { JSDOM } = require('jsdom');

// Define the HTML content directly in the test file
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Month Page</title>
    <link rel="stylesheet" href="month_page.css" class="stylesheet">
</head>
<body>
    <div>
        <div class="month-header-div">
            <h1>Calendar</h1>
            <button class="month-btn" onclick="window.location.href='../monthPage/month_page.html'">Month</button>
            <button class="week-btn" onclick="window.location.href='../weekPage/week_page.html'">Weekly</button>
            <button class="log-btn" onclick="window.location.href='../addLogPage/add_log_page.html'">+</button>
        </div>
        <div class="month-calendar-div">
            <section class="calendar">
                <h3></h3>
                <nav>
                    <button id="prev"></button>
                    <button id="next"></button>
                </nav>
                <ul class="days">
                    <li>Sun</li>
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sat</li>
                </ul>
                <ul class="dates"></ul>
            </section>
        </div>
    </div>
    <script>
    const header = document.querySelector(".calendar h3");
    const dates = document.querySelector(".dates");
    const navs = document.querySelectorAll("#prev, #next");

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();

    function renderCalendar() {
        const start = new Date(year, month, 1).getDay();
        const endDate = new Date(year, month + 1, 0).getDate();
        const end = new Date(year, month, endDate).getDay();
        const endDatePrev = new Date(year, month, 0).getDate();

        dates.innerHTML = ""; // Clear previous dates

        // Add dates of previous month
        for (let i = start; i > 0; i--) {
            const li = document.createElement('li');
            li.className = 'inactive';
            li.textContent = endDatePrev - i + 1;
            dates.appendChild(li);
        }

        // Add dates of current month
        for (let i = 1; i <= endDate; i++) {
            const li = document.createElement('li');
            if (i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                li.className = 'today';
            }
            li.textContent = i;
            dates.appendChild(li);
        }

        // Add dates of next month
        for (let i = end; i < 6; i++) {
            const li = document.createElement('li');
            li.className = 'inactive';
            li.textContent = i - end + 1;
            dates.appendChild(li);
        }

        header.textContent = \`\${months[String(month)]} \${String(year)}\`;
    }

    navs.forEach((nav) => {
        nav.addEventListener("click", (e) => {
            const btnId = e.target.id;

            if (btnId === "prev" && month === 0) {
                year--;
                month = 11;
            } else if (btnId === "next" && month === 11) {
                year++;
                month = 0;
            } else {
                month = btnId === "next" ? month + 1 : month - 1;
            }

            date = new Date(year, month, new Date().getDate());
            year = date.getFullYear();
            month = date.getMonth();

            renderCalendar();
        });
    });

    renderCalendar();
    </script>
</body>
</html>
`;

const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
const { document } = window;

describe('Calendar Widget', () => {
    let prevButton, nextButton, currentDate;

    beforeAll(() => {
        // Set up the DOM elements
        prevButton = document.getElementById('prev');
        nextButton = document.getElementById('next');
        currentDate = new Date();
    });

    test('should load the current date correctly', () => {
        const loadedDate = document.querySelector('.calendar h3').textContent;
        const expectedDate = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

        console.log('Loaded Date:', loadedDate);
        console.log('Expected Date:', expectedDate);

        expect(loadedDate).toBe(expectedDate);
    });

    test('should navigate back and forth through the calendar', () => {
        const initialDate = document.querySelector('.calendar h3').textContent;

        console.log('Initial Date:', initialDate);

        // Simulate clicking the next button
        nextButton.click();
        const nextDate = document.querySelector('.calendar h3').textContent;

        console.log('Date after clicking next:', nextDate);

        expect(nextDate).not.toBe(initialDate);

        // Simulate clicking the prev button
        prevButton.click();
        const prevDate = document.querySelector('.calendar h3').textContent;

        console.log('Date after clicking prev:', prevDate);

        expect(prevDate).toBe(initialDate);
    });
});
