// Import the functions
const { switchWeekly, switchMonthly, redirectToAddLogPage,} = require('../dayPage/day_page');

// Mock the global window object
global.window = {
    location: {
      href: ''
    }
};

// Mock the document.querySelector
global.document = {
    querySelector: jest.fn((selector) => {
      const elements = {
        "#log-title": { value: 'Sample Title' },
        "#log-time": { value: '12:00' },
        "#log-contributor": { value: 'John Doe' },
        "#log-description": { value: 'Sample Description' },
      };
      return elements[selector];
    })
};

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