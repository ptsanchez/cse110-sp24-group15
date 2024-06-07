// Import jsdom
const { JSDOM } = require('jsdom');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Home Page</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="home_page.css"> 
</head>
<body>
    <header>
        <h1 class="header-title"> Jover 15 </h1>
        <nav class="header-nav">
            <a href="../homePage/home_page.html"><button class="nav-button">Home Page</button></a>
            <a href="https://cse110-sp24-group15.github.io/warmup-exercise/index.html" target="_blank"><button class="nav-button">Team Page</button></a>
        </nav>
    </header>

    <main>
        <div class="sub-header">
            <h2 class="active-projects-title">Active Projects</h2>
            <div class="search-container">
                <input type="text" class="search" placeholder="Search projects..." onkeyup="searchProjects(this.value)">
            </div>
        </div>
        <div class="project-list">
            <ul class="projects"></ul>
            <div class="add-project">
                <a href="../addProjectPage/add_project_page.html" class="add-project-btn">Add New Project</a>
            </div>
            <div class="archive">
                <a href="../archivePage/archive_page.html" class="archive-btn">Archive Page</a>
            </div>
        </div>
    </main>

    <footer>
        <div class="feedback-section">
            <h2>Feedback</h2>
            <p>Give us your feedback to improve our team's performance and collaboration. Please share your thoughts with us.</p>
            <a href="../feedBackPage/Feedback_page.html"><button class="feedback-button">Give Feedback</button></a>
        </div>
        <p>&copy; 2024 Group 15 [Jover]. All rights reserved.</p>
    </footer>


    <script src="home_page.js"></script>

    <script>
        // Function to search projects
        function searchProjects(searchTerm) {
            const projectElements = document.querySelectorAll('.projects li');
            projectElements.forEach(projectElement => {
                const projectName = projectElement.querySelector('h3').textContent.toLowerCase();
                if (projectName.includes(searchTerm.toLowerCase())) {
                    projectElement.style.display = 'block';
                } else {
                    projectElement.style.display = 'none';
                }
            });
        }
    </script>

</body>
</html>
`;


// Set up jsdom
const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
const { document } = window;

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
  