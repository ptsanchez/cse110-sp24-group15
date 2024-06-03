// Import the functions
const { validateForm, makeSubmission, cancelSubmission } = require('../addLogPage/add_log_page');

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

// Mock CodeMirror
global.CodeMirror = {
  fromTextArea: jest.fn().mockImplementation(() => {
    return {
      getValue: jest.fn().mockReturnValue('console.log("Hello, world!");'),
    };
  }),
};

// Initialize window.editor before each test that requires it
beforeEach(() => {
  window.editor = CodeMirror.fromTextArea();
});

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

describe('Cancel Submission', () => {
  test('Window redirects to day page when cancelSubmission is called', () => {
    // Call cancelSubmission
    cancelSubmission();

    // Ensure window.location.href is set to the day page URL
    expect(window.location.href).toBe('../dayPage/day_page.html');
  });
});

describe('Log Submission', () => {
  test('Form submission adds log to localStorage', () => {
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

    // Ensure localStorage setItem is called
    const expectedLog = {
      data: 'Sample Description',
      time: '12:00',
      Month: '05',
      day: '29',
      Year: '2024',
      title: 'Sample Title',
      contributors: 'John Doe',
      codeSnippet: 'console.log("Hello, world!");', // For codeSnippet
    };
    mockProjectData.project_data.project1.logs.push(expectedLog);
    expect(localStorage.setItem).toHaveBeenCalledWith('project_data', JSON.stringify(mockProjectData));
  });

  test('Form accurately adds log submission to localStorage', () => {
    // Create dummy logs
    const dummyLog = {
      title: 'Dummy Title',
      time: '15:30',
      contributors: 'Jane Doe',
      description: 'Dummy Description'
    };

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

    // Call makeSubmission with dummy log
    document.getElementById = jest.fn((id) => {
      const elements = {
        "log-title": { value: dummyLog.title },
        "log-time": { value: dummyLog.time },
        "log-contributor": { value: dummyLog.contributors },
        "log-description": { value: dummyLog.description },
      };
      return elements[id];
    });

    makeSubmission();

    // Ensure log submission is accurate
    const expectedLog = {
      data: dummyLog.description,
      time: dummyLog.time,
      Month: '05',
      day: '29',
      Year: '2024',
      title: dummyLog.title,
      contributors: dummyLog.contributors,
      codeSnippet: 'console.log("Hello, world!");', // For codeSnippet
    };
    mockProjectData.project_data.project1.logs.push(expectedLog);
    expect(localStorage.setItem).toHaveBeenCalledWith('project_data', JSON.stringify(mockProjectData));

    // Ensure redirection happens
    expect(window.location.href).toBe('../dayPage/day_page.html');
  });
});
