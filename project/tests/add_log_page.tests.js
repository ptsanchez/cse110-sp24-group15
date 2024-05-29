const { validateForm, makeSubmission } = require('../addLogPage/add_log_page');

global.alert = jest.fn();

describe('Form Validation', () => {
  test('Form only submits if all text entries are valid', () => {
    // Invalid entries
    expect(validateForm('', 'time', 'contributors', 'description')).toBe(false);
    expect(validateForm('title', '', 'contributors', 'description')).toBe(false);
    expect(validateForm('title', 'time', '', 'description')).toBe(false);
    expect(validateForm('title', 'time', 'contributors', '')).toBe(false);
    
    // Valid entries
    expect(validateForm('title', 'time', 'contributors', 'description')).toBe(true);
  });
});


// Mock the alert function
global.alert = jest.fn();

// Mock the global window object
global.window = {
  location: {
    href: ''
  }
};

// Mock the localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

// Mock the document.getElementById
global.document = {
  getElementById: jest.fn((id) => {
    const elements = {
      "log-title": { value: 'Sample Title' },
      "log-time": { value: '12:00' },
      "log-contributor": { value: 'John Doe' },
      "log-description": { value: 'Sample Description' },
    };
    return elements[id];
  })
};

describe('makeSubmission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should validate form and redirect on successful submission', () => {
    // Mock localStorage data
    const mockProjectData = {
      "current_project": "project1",
      "project_data": {
        "project1": {
          "logs": []
        }
      },
      "current_date": "05/29/2024"
    };
    localStorage.getItem.mockReturnValue(JSON.stringify(mockProjectData));

    makeSubmission();

    // Ensure validateForm is called
    expect(alert).not.toHaveBeenCalled();

    // Ensure localStorage setItem is called
    const expectedLog = {
      data: 'Sample Description',
      time: '12:00',
      Month: '05',
      day: '29',
      Year: '2024',
      title: 'Sample Title',
      contributors: 'John Doe',
    };
    mockProjectData.project_data.project1.logs.push(expectedLog);
    expect(localStorage.setItem).toHaveBeenCalledWith('project_data', JSON.stringify(mockProjectData));

    // Ensure redirection happens
    expect(window.location.href).toBe('../dayPage/day_page.html');
  });

  test('should alert on invalid form submission', () => {
    // Mock getElementById for invalid form data
    document.getElementById = jest.fn((id) => {
      const elements = {
        "log-title": { value: '' },
        "log-time": { value: '' },
        "log-contributor": { value: '' },
        "log-description": { value: '' },
      };
      return elements[id];
    });

    makeSubmission();

    // Ensure alert is called
    expect(alert).toHaveBeenCalledWith('Please fill in all fields.');
  });
});