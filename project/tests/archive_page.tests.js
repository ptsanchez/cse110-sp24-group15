// Import functions from archive_page.js
const {
  populateProjectList,  
  moveToPreviousPage,   
  moveToNextPage,       
  handleSearch,
} = require('../archivePage/archive_page');

// Mock DOM manipulation
global.document = {
  body: {
    innerHTML: `
      <div class="ArchivePageHeaderDiv">
        <input type="search" class="Search" placeholder="Type to search...">
      </div>
      <div class="ArchiveProjectListDiv">
        <ul class="ProjectList"></ul>
      </div>
      <div class="ArchivePageBtns">
        <button class="pageBackBtn">Page Back</button>
        <button class="pageNextBtn">Next Page</button>
      </div>
    `
  },
  querySelectorAll: jest.fn((selector) => {
    if (selector === '.ProjectList li') {
      // Mock project list items
      return [{}, {}]; // Mocking two project list items
    }
  }),
  querySelector: jest.fn((selector) => {
    if (selector === '.Search') {
      // Mock search input element
      return {
        value: '', // Mock initial value
        addEventListener: jest.fn(), // Mock addEventListener method
        dispatchEvent: jest.fn() // Mock dispatchEvent method
      };
    }
  }),
  createElement: jest.fn((tagName) => {
    if (tagName === 'button') {
      // Mock delete button
      return {
        className: '',
        click: jest.fn()
      };
    } else if (tagName === 'li') {
      // Mock project item
      return {
        className: '',
        click: jest.fn()
      };
    }
  })
};

// Describe the test suite
describe('Project Management System Tests', () => {
  let projectData;

  // Mock localStorage and sessionStorage
  beforeEach(() => {
    projectData = {
      project_1: { projectName: 'Project 1', active: true },
      project_2: { projectName: 'Project 2', active: true },
      // Add more sample project data as needed
    };

    global.localStorage = {
      getItem: jest.fn(() => JSON.stringify(projectData)),
      setItem: jest.fn(),
      clear: jest.fn(),
    };

    global.sessionStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
  });

  // Test if all archived projects are correctly loaded
  test('All archived projects are correctly loaded', () => {
    // Populate project list
    populateProjectList(1);

    // Expect all archived projects to be present in the project list
    const projectListItems = document.querySelectorAll('.ProjectList li');
    expect(projectListItems.length).toBe(Object.keys(projectData).length);
  });

  // Test if page back works correctly
  test('Page back works correctly', () => {
    // Set current page to 2
    sessionStorage.setItem('currentPage', '2');

    // Simulate clicking page back button
    moveToPreviousPage();

    // Expect current page to be 1
    expect(sessionStorage.getItem('currentPage')).toBe('1');
  });

  // Test if page next works correctly
  test('Page next works correctly', () => {
    // Set current page to 1
    sessionStorage.setItem('currentPage', '1');

    // Simulate clicking page next button
    moveToNextPage();

    // Expect current page to be 2
    expect(sessionStorage.getItem('currentPage')).toBe('2');
  });

  // Test if search works correctly
  test('Search works correctly', () => {
    // Populate project list
    populateProjectList(1);

    // Simulate entering search query
    const searchInput = document.querySelector('.Search');
    searchInput.value = 'Project 1';

    // Trigger keypress event to simulate search
    const event = new KeyboardEvent('keypress', { key: 'Enter' });
    searchInput.dispatchEvent(event);

    // Expect only one project to be displayed
    const projectListItems = document.querySelectorAll('.ProjectList li');
    expect(projectListItems.length).toBe(1);
    expect(projectListItems[0].textContent).toContain('Project 1');
  });

  // Test if delete works correctly
  test('Delete works correctly', () => {
    // Populate project list
    populateProjectList(1);

    // Simulate clicking delete button for a project
    const deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    document.querySelector('.ProjectList').appendChild(deleteButton);
    deleteButton.click();

    // Expect the project to be removed from the project list
    const projectListItems = document.querySelectorAll('.ProjectList li');
    expect(projectListItems.length).toBe(Object.keys(projectData).length - 1);
  });

  // Test if current_project in localStorage is set correctly when a project is pressed
  test('Current project in localStorage is set correctly when a project is pressed', () => {
    // Populate project list
    populateProjectList(1);

    // Simulate clicking on a project
    const projectItem = document.createElement('li');
    projectItem.className = 'Project';
    document.querySelector('.ProjectList').appendChild(projectItem);
    projectItem.click();

    // Expect current_project in localStorage to be set correctly
    const currentProject = JSON.parse(localStorage.getItem('projectData')).current_project;
    expect(currentProject).toBeDefined();
    expect(projectData[currentProject]).toBeDefined();
  });
});