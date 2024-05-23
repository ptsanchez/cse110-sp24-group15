// import functions from archive_page.js
import {
  populateProhectList,
  movetoPreviousPage,
  moveToNextPage, 
  handleSearch,
} from '../archivePage/archive_page';

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

    window.localStorage.setItem('projectData', JSON.stringify(projectData));
    window.sessionStorage.setItem('inactiveProjects', JSON.stringify({}));
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
    window.sessionStorage.setItem('currentPage', '2');

    // Simulate clicking page back button
    moveToPreviousPage();

    // Expect current page to be 1
    expect(window.sessionStorage.getItem('currentPage')).toBe('1');
  });

  // Test if page next works correctly
  test('Page next works correctly', () => {
    // Set current page to 1
    window.sessionStorage.setItem('currentPage', '1');

    // Simulate clicking page next button
    moveToNextPage();

    // Expect current page to be 2
    expect(window.sessionStorage.getItem('currentPage')).toBe('2');
  });

  // Test if search works correctly
  test('Search works correctly', () => {
    // Populate project list
    populateProjectList(1);

    // Simulate entering search query
    document.querySelector('.Search').value = 'Project 1';

    // Trigger keypress event to simulate search
    handleSearch({ key: 'Enter' });

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
    const deleteButton = document.querySelector('.deleteButton');
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
    const projectItem = document.querySelector('.ProjectList li');
    projectItem.click();

    // Expect current_project in localStorage to be set correctly
    const currentProject = JSON.parse(window.localStorage.getItem('projectData')).current_project;
    expect(currentProject).toBeDefined();
    expect(projectData[currentProject]).toBeDefined();
  });
});
