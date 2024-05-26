import { validateForm, makeSubmission } from '../yourJavaScriptFile';

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

describe('Local Storage', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};

    return {
      getItem: key => store[key],
      setItem: (key, value) => store[key] = value,
      clear: () => store = {}
    };
  })();

  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  test('Form log submission adds to localStorage', () => {
    // Mock form data
    const log_title = 'Test Title';
    const log_time = '12:00';
    const log_contributors = 'Tester';
    const log_description = 'Test Description';

    // Call the makeSubmission function
    makeSubmission(log_title, log_time, log_contributors, log_description);

    // Retrieve the submitted log entry from localStorage
    const storedData = JSON.parse(localStorage.getItem('project_data'));
    const current_project = storedData.current_project;
    const projects = storedData.project_data[current_project];
    const logs = projects.logs;

    // Check if the submitted log entry is present in localStorage
    const submittedLog = logs.find(log => log.title === log_title);
    expect(submittedLog).toBeDefined();
    expect(submittedLog.time).toBe(log_time);
    expect(submittedLog.contributors).toBe(log_contributors);
    expect(submittedLog.data).toBe(log_description);
  });
});

// Dummy logs and check if form adds log submission accurately
describe('Form Submission', () => {
  test('Form adds log submission accurately', () => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};

      return {
        getItem: key => store[key],
        setItem: (key, value) => store[key] = value,
        clear: () => store = {}
      };
    })();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Mock form data
    const log_title = 'Dummy Log Title';
    const log_time = '10:30';
    const log_contributors = 'John Doe';
    const log_description = 'This is a dummy log entry.';

    // Call the makeSubmission function
    makeSubmission(log_title, log_time, log_contributors, log_description);

    // Retrieve the submitted log entry from localStorage
    const storedData = JSON.parse(localStorage.getItem('project_data'));
    const current_project = storedData.current_project;
    const projects = storedData.project_data[current_project];
    const logs = projects.logs;

    // Check if the submitted log entry is present in localStorage
    const submittedLog = logs.find(log => log.title === log_title);
    expect(submittedLog).toBeDefined();
    expect(submittedLog.time).toBe(log_time);
    expect(submittedLog.contributors).toBe(log_contributors);
    expect(submittedLog.data).toBe(log_description);
  });
});
