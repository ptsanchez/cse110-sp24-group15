// Mock the global window object
global.window = {
  location: {
    href: ''
  },
  addEventListener: jest.fn(), // Mock addEventListener on the window object
};

// Mock the localStorage
global.localStorage = {
  getItem: jest.fn((key) => {
    if (key === 'project_data') {
      return JSON.stringify({
        current_project: "project_1",
        current_date: "06/03/2024",
        project_data: {
          project_1: {
            projectName: "Project One",
            projectTag: "Tag1",
            projectContributors: "Contributor1",
            projectDescription: "Description1",
            active: false,
            logs: {},
            BranchLink: "link1",
            TodoList: {}
          },
          project_2: {
            projectName: "Project Two",
            projectTag: "Tag2",
            projectContributors: "Contributor2",
            projectDescription: "Description2",
            active: false,
            logs: {},
            BranchLink: "link2",
            TodoList: {}
          },
          project_3: {
            projectName: "Project Three",
            projectTag: "Tag3",
            projectContributors: "Contributor3",
            projectDescription: "Description3",
            active: true,
            logs: {},
            BranchLink: "link3",
            TodoList: {}
          }
        }
      });
    }
  }),
  setItem: jest.fn(),
  clear: jest.fn()
};

let currentPage = 1; // Ensure this is in the correct scope of your test file

// Mock the sessionStorage
global.sessionStorage = {
  getItem: jest.fn((key) => {
    if (key === "current_page") {
      return JSON.stringify(currentPage);
    } else if (key === 'archived_projects') {
      return JSON.stringify([
        {
          projectName: "Project One",
          projectTag: "Tag1",
          projectContributors: "Contributor1",
          projectDescription: "Description1",
          active: false,
          logs: {},
          BranchLink: "link1",
          TodoList: {}
        },
        {
          projectName: "Project Two",
          projectTag: "Tag2",
          projectContributors: "Contributor2",
          projectDescription: "Description2",
          active: false,
          logs: {},
          BranchLink: "link2",
          TodoList: {}
        }
      ]);
    }
    return null;
  }),
  setItem: jest.fn(),
  clear: jest.fn()
};

// Mock the document methods
global.document = {
  getElementById: jest.fn((id) => {
    if (id === 'search-bar') {
      return {
        addEventListener: jest.fn(), // Mock addEventListener method for search-bar
        value: '',
        dispatchEvent: jest.fn() // Mock dispatchEvent for search-bar
      };
    }
  }),
  querySelector: jest.fn((selector) => {
    if (selector === '.project-list') {
      return {
        innerHTML: '',
        appendChild: jest.fn(),
        querySelector: jest.fn((sel) => {
          if (sel === 'button.delete-btn') {
            return { click: jest.fn() };
          } else if (sel === '.project') {
            return { click: jest.fn() };
          }
        })
      };
    } else if (selector === '.page-back-btn' || selector === '.page-next-btn') {
      return { addEventListener: jest.fn() };
    }
  }),
  querySelectorAll: jest.fn((selector) => {
    if (selector === '.project-list .project') {
      return [
        {
          addEventListener: jest.fn(),
          click: jest.fn()
        }
      ];
    }
  }),
  addEventListener: jest.fn((event, callback) => {
    if (event === 'DOMContentLoaded') {
      callback();
    }
  })
};

// Mock the document.createElement method
global.document.createElement = jest.fn((tagName) => {
  const element = {
    tagName,
    classList: {
      add: jest.fn()
    },
    innerHTML: '',
    appendChild: jest.fn(),
    addEventListener: jest.fn(),
    querySelector: jest.fn((selector) => {
      if (selector === '.delete-btn') {
        return {
          addEventListener: jest.fn()
        };
      }
    })
  };
  return element;
});

// Mock KeyboardEvent if not available
global.KeyboardEvent = class {
  constructor(eventType, init) {
    this.type = eventType;
    Object.assign(this, init);
  }
};

// Import the functions
const { loadProjects, displayProjects, handlePageChange, handleSearch, deleteProject } = require('../archivePage/archive_page');

describe('Archive Page Tests', () => {
  let testData;

  beforeEach(() => {
    testData = {
      current_project: "project_1",
      current_date: "06/03/2024",
      project_data: {
        project_1: {
          projectName: "Project One",
          projectTag: "Tag1",
          projectContributors: "Contributor1",
          projectDescription: "Description1",
          active: false,
          logs: {},
          BranchLink: "link1",
          TodoList: {}
        },
        project_2: {
          projectName: "Project Two",
          projectTag: "Tag2",
          projectContributors: "Contributor2",
          projectDescription: "Description2",
          active: false,
          logs: {},
          BranchLink: "link2",
          TodoList: {}
        },
        project_3: {
          projectName: "Project Three",
          projectTag: "Tag3",
          projectContributors: "Contributor3",
          projectDescription: "Description3",
          active: true,
          logs: {},
          BranchLink: "link3",
          TodoList: {}
        }
      }
    };
    localStorage.getItem.mockReturnValue(JSON.stringify(testData));
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('should load all archived projects correctly', () => {
    loadProjects();
    const projectList = document.querySelector('.project-list');
    expect(projectList.appendChild).toHaveBeenCalledTimes(2);
  });

  test('page back works correctly', () => {
    currentPage = 2;
    handlePageChange(-1);
    expect(currentPage).toBe(1);
    expect(sessionStorage.setItem).toHaveBeenCalledWith('current_page', 1);
  });

  test('page next works correctly', () => {
    loadProjects();
    handlePageChange(1);
    const totalPages = Math.ceil(2 / 5); // Assuming projectsPerPage is 5
    expect(currentPage).toBe(Math.min(2, totalPages));
    expect(sessionStorage.setItem).toHaveBeenCalledWith('current_page', currentPage);
  });

  test('search works correctly', () => {
    loadProjects();
    const searchBar = document.getElementById('search-bar');
    searchBar.value = 'Project One';
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    searchBar.dispatchEvent(event);
    expect(currentPage).toBe(1);
  });

  test('delete works correctly', () => {
    loadProjects();
    const projectList = document.querySelector('.project-list');
    const deleteButton = projectList.querySelector('button.delete-btn');
    deleteButton.click();
    const remainingProjects = JSON.parse(sessionStorage.getItem('archived_projects'));
    expect(remainingProjects.length).toBe(1);
    const updatedData = JSON.parse(localStorage.getItem('project_data'));
    expect(updatedData.project_data.project_1).toBeUndefined();
  });

  test('when a project is pressed, current_project in localStorage is set correctly', () => {
    loadProjects();
    const projectList = document.querySelector('.project-list');
    const firstProject = projectList.querySelector('.project');
    firstProject.click();
    const updatedData = JSON.parse(localStorage.getItem('project_data'));
    expect(updatedData.current_project).toBe('project_1');
    expect(window.location.href).toBe(escape("../projects/projectHomePage/project_home_page.html"));
  });
});