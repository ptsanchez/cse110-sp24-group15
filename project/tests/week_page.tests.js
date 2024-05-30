// Import the functions
const { switchWeekly, switchMonthly, redirectToAddLogPage, } = require('../weekPage/week_page');

// Mock the global window object
global.window = {
    location: {
      href: ''
    }
};

// Mocking the DOM elements
document.body.innerHTML = `
    <div id="week-display"></div>
    <button id="prev-week-btn"></button>
    <button id="next-week-btn"></button>
    <div class="day-column"></div>
`;

describe('Click week button', () => {
    test('Window redirects to week page when switchWeekly is called', () => {
      switchWeekly();
  
      // Ensure window.location.href is set to the day page URL
      expect(window.location.href).toBe('../weekPage/week_page.html');
    });
});

describe('Click month button', () => {
    test('Window redirects to month page when switchMonthly is called', () => {
        switchMonthly();
  
      // Ensure window.location.href is set to the day page URL
      expect(window.location.href).toBe('../monthPage/month_page.html');
    });
});

describe('Click add log button', () => {
    test('Window redirects to add log page when redirectToAddLogPage is called', () => {
      redirectToAddLogPage();
  
      // Ensure window.location.href is set to the day page URL
      expect(window.location.href).toBe('../addLogPage/add_log_page.html');
    });
});

describe('Click a day', () => {
    test('Window redirects to day page when a day is clicked', () => {
      const day = document.querySelector('.day-column');
      day.click();
  
      // Ensure window.location.href is set to the day page URL
      expect(window.location.href).toBe('../dayPage/day_page.html');
    });
});
