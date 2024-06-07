// Import jsdom
const { JSDOM } = require('jsdom');

// Set up jsdom
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

// Now you can import your functions and write tests
const {
  searchProjects,
  deleteProject,
  archiveProject,
  renderProjects,
  createProjectElement
} = require('../homePage/home_page');
  
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn().mockImplementation((key) => store[key]),
      setItem: jest.fn().mockImplementation((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn().mockImplementation(() => {
        store = {};
      })
    };
  })();
  global.localStorage = localStorageMock;
  
  // Mock document methods
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <div class="sub-header">
          <input type="text" class="search" placeholder="Search projects..." onkeyup="searchProjects(this.value)">
        </div>
        <ul class="projects"></ul>
      </main>`;
  });
  
  describe('Search Functionality', () => {
    test('Search projects by name', () => {
      // Call search function
      searchProjects('project 1');
  
      // Verify the search results
      const projects = document.querySelectorAll('.projects li');
      expect(projects.length).toBe(0); // Assuming no matching project in this case
    });
  });
  
  describe('Delete Project Functionality', () => {
    test('Delete a project', () => {
      // Mock localStorage data
      localStorage.setItem('project_data', JSON.stringify({ '1': { active: true } }));
  
      // Call deleteProject function
      deleteProject(1);
  
      // Verify if the project is deleted from localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('project_data', '{}');
    });
  });
  
  describe('Archive Functionality', () => {
    test('Archive a project', () => {
      // Mock localStorage data
      localStorage.setItem('project_data', JSON.stringify({ '1': { active: true } }));
  
      // Call archiveProject function
      archiveProject(1);
  
      // Verify if the project is archived in localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('project_data', '{"1":{"active":false}}');
    });
  });
  
  describe('Render Projects Functionality', () => {
    test('Render projects list', () => {
      // Mock localStorage data
      localStorage.setItem('project_data', JSON.stringify({ '1': { active: true, projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Contrib1', projectDescription: 'Desc1' } }));
  
      // Call renderProjects function
      renderProjects();
  
      // Verify if the project is rendered correctly
      const projectList = document.querySelector('.projects');
      expect(projectList.children.length).toBe(1);
  
      const projectElement = projectList.querySelector('li');
      expect(projectElement.querySelector('h3').textContent).toBe('Project 1');
      expect(projectElement.querySelector('p').textContent).toBe('Tag: Tag1');
    });
  });
  
  describe('Create Project Element Functionality', () => {
    test('Create project element', () => {
      // Create a dummy project object
      const project = {
        projectName: 'Project 1',
        projectTag: 'Tag1',
        projectContributors: 'Contrib1',
        projectDescription: 'Desc1'
      };
  
      // Create a dummy projectId
      const projectId = '1';
  
      // Call createProjectElement function
      const projectElement = createProjectElement(project, projectId);
  
      // Verify if the project element is created correctly
      expect(projectElement.tagName).toBe('LI');
      expect(projectElement.querySelector('h3').textContent).toBe('Project 1');
      expect(projectElement.querySelector('p').textContent).toBe('Tag: Tag1');
    });
  });
  