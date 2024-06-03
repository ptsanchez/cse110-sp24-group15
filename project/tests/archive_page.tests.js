// Mock the global window object
global.window = {
  location: {
    href: ''
  }
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

let page = 1;

// Mock the sessionStorage
global.sessionStorage = {
  getItem: jest.fn((key) => {
    if (key === "current_page") {
      return page;
    }
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
        value: ''
      };
    }
  }),
  querySelector: jest.fn((selector) => {
    if (selector === '.project-list') {
      return {
        innerHTML: '',
        appendChild: jest.fn()
      };
    } else if (selector === '.page-back-btn' || selector === '.page-next-btn') {
      return { addEventListener: jest.fn() };
    }
  }),
  querySelectorAll: jest.fn((selector) => {
    if (selector === '.project-list .project') {
      return [];
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

// Import the functions
const { loadProjects, displayProjects, handlePageChange, handleSearch, setCurrentProject } = require('../archivePage/archive_page');

describe('Archive Page Tests', () => {
  beforeEach(() => {
    // Set up localStorage with test data
    const testData = {
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
    let localStorageData = JSON.parse(localStorage.getItem('project_data'));
    let projects = localStorageData['project_data'];

    // Convert the projects object to an array
    let projectArray = Object.values(projects);

    // Check the total number of projects
    expect(projectArray.length).toBe(3);

    // Filter out the archived projects (active: false)
    let archivedProjects = projectArray.filter(project => !project.active);

    //console.log(archivedProjects);  // For debugging
    expect(archivedProjects.length).toBe(2);
  });


});
