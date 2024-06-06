const { renderProjects, archiveProject,  deleteProject} = require('../homePage/home_page'); 

htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Management App</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="home_page.css">
</head>
<body>
    <header>
        <nav>
            <a href="#" class="logo">Project Manager</a>
            <button>Login</button>
        </nav>
    </header>
    <main>
        <div class="sub-header">
            <h2 class="active-projects-title">Active Projects</h2>
            <div>
                <input type="text" class="search" placeholder="Search projects..." onkeyup="searchProjects(this.value)">
                <a href="../addProjectPage/add_project_page.html" class="add-project-btn"><i class="fas fa-plus"></i></a>
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
        <button>Footer Button</button>
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
</html>`;


const { JSDOM } = require('jsdom');
const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
const { document } = window;


// Mock the alert function
global.alert = jest.fn();

// Mock the localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
};

global.dummyProjectData = {
    project_data: {
        1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
        2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: false }
    }
};

// Mock the document.getElementById
// global.document = {
//     getElementById: jest.fn((id) => {
//         const elements = {};
//         return elements[id];
//     }),
//     querySelectorAll: jest.fn((selector) => {
//         // Mock the querySelectorAll for radio buttons
//         if (selector === 'input[type="radio"]:checked') {
//             return [];
//         }
//         return [];
//     })
// };

describe('Render Projects', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render active projects correctly', () => {
        const dummyProjectData = {
            project_data: {
                1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
                2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: false }
            }
        };

        localStorage.getItem.mockReturnValue("project-data", JSON.stringify(dummyProjectData));

        renderProjects();

        const projectsList = document.querySelector('.projects');
        expect(projectsList.children.length).toBe(1);
        expect(projectsList.children[0].querySelector('h3').textContent).toBe('Project 1');
    });
});