// Import the functions from your main script
const { populateProjectList, moveToPreviousPage, moveToNextPage, handleSearch } = require('../archivePage/archive_page');

// Function to set localStorage with given key and value
function setLocalStorage(key, value) {
  const mockSetItem = jest.fn();
  const mockGetItem = jest.fn().mockReturnValueOnce(value);
  window.localStorage = {
    getItem: mockGetItem,
    setItem: mockSetItem,
  };
}

describe('Populate Project List', () => {
  it('should populate the project list correctly', () => {
    // Mock project data
    const projectData = {
      project_1: { projectName: 'Project 1', active: true },
      project_2: { projectName: 'Project 2', active: true }
      // Add more sample project data as needed
    };

    // Set localStorage with mock project data
    setLocalStorage('projectData', JSON.stringify(projectData));

    // Mock document methods
    document.body.innerHTML = '<ul class="ProjectList"></ul>';

    // Call the function
    populateProjectList(1);

    // Expectations
    const projectListItems = document.querySelectorAll('.ProjectList li');
    expect(projectListItems.length).toBe(Object.keys(projectData).length);
  });
});

describe('Move to Previous Page', () => {
  it('should move to the previous page correctly', () => {
    // Mock sessionStorage
    const mockSetItem = jest.fn();
    const mockGetItem = jest.fn().mockReturnValueOnce('2');
    global.sessionStorage = {
      getItem: mockGetItem,
      setItem: mockSetItem,
    };

    // Call the function
    moveToPreviousPage();

    // Expectations
    expect(global.sessionStorage.setItem).toHaveBeenCalledWith('currentPage', '1');
  });
});

describe('Move to Next Page', () => {
  it('should move to the next page correctly', () => {
    // Mock sessionStorage
    const mockSetItem = jest.fn();
    const mockGetItem = jest.fn().mockReturnValueOnce('1');
    global.sessionStorage = {
      getItem: mockGetItem,
      setItem: mockSetItem,
    };

    // Call the function
    moveToNextPage();

    // Expectations
    expect(global.sessionStorage.setItem).toHaveBeenCalledWith('currentPage', '2');
  });
});

describe('Search Functionality', () => {
  it('should search for projects correctly', () => {
    // Mock project data
    const projectData = {
      project_1: { projectName: 'Project 1', active: true },
      project_2: { projectName: 'Project 2', active: true }
      // Add more sample project data as needed
    };

    // Set localStorage with mock project data
    setLocalStorage('projectData', JSON.stringify(projectData));

    // Mock document methods
    document.body.innerHTML = '<ul class="ProjectList"></ul><input class="search" />';

    // Set input value
    const searchInput = document.querySelector('.search');
    searchInput.value = 'Project 1';

    // Call the function
    handleSearch();

    // Expectations
    const projectListItems = document.querySelectorAll('.ProjectList li');
    expect(projectListItems.length).toBe(1);
    expect(projectListItems[0].textContent).toContain('Project 1');
  });
});
