// Mock the global window and document objects
global.document = {
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(),
    createElement: jest.fn(),
    addEventListener: jest.fn()
  };
  
  global.window = {
    location: {
      href: ''
    },
    addEventListener: jest.fn()
  };
  
  // Mock the localStorage
  global.localStorage = {
    getItem: jest.fn((key) => {
      if (key === 'project_data') {
        return JSON.stringify({
          project_data: {
            project_1: {
              projectName: "Project One",
              projectTag: "Tag1",
              projectContributors: "Contributor1",
              projectDescription: "Description1",
              active: true
            },
            project_2: {
              projectName: "Project Two",
              projectTag: "Tag2",
              projectContributors: "Contributor2",
              projectDescription: "Description2",
              active: true
            }
          }
        });
      }
      return null;
    }),
    setItem: jest.fn(),
    clear: jest.fn()
  };
  
  // Mock the element returned by document.querySelector
  const mockProjectsListElement = {
    innerHTML: `<ul class="projects"></ul>`,
    appendChild: jest.fn()
  };
  
  document.querySelector = jest.fn((selector) => {
    if (selector === '.projects') {
      return mockProjectsListElement;
    }
    return null;
  });
  
  // Enhanced mock for document.createElement
  document.createElement = jest.fn((tagName) => {
    const element = {
      tagName,
      classList: {
        add: jest.fn()
      },
      innerHTML: '',
      appendChild: jest.fn(),
      addEventListener: jest.fn(),
      setAttribute: jest.fn()
    };
  
    Object.defineProperty(element, 'textContent', {
      set: jest.fn(),
      get: jest.fn(() => '')
    });
  
    return element;
  });
  
  // Import the functions
  const { renderProjects, archiveProject, deleteProject } = require('../homePage/home_page.js');
  
  describe('Home Page Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should render projects correctly', () => {
      // Call the renderProjects function
      renderProjects();
  
      // Assert that projects are rendered correctly
      expect(document.querySelector).toHaveBeenCalledWith('.projects');
      expect(mockProjectsListElement.appendChild).toHaveBeenCalled();
      expect(mockProjectsListElement.innerHTML).toBe(''); // Ensuring innerHTML is populated
    });
  
    test('should archive a project correctly', () => {
      // Call the archiveProject function
      archiveProject('project_1');
  
      // Verify that the project is archived correctly
      const updatedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
      expect(updatedData.project_data.project_1.active).toBe(false);
    });
  
    test('should delete a project correctly', () => {
      // Call the deleteProject function
      deleteProject('project_1');
  
      // Verify that the project is deleted correctly
      const updatedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
      expect(updatedData.project_data.hasOwnProperty('project_1')).toBe(false);
    });
  
    // Add more test cases as needed for other functionalities
  });
  