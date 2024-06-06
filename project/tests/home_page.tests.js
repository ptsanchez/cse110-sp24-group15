const { JSDOM } = require('jsdom');

// Define the HTML content directly in the test file
const htmlContent = `
<!DOCTYPE html>
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
</html>
`;

const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
const { document } = window;

// Mock the localStorage
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = value.toString();
    }

    removeItem(key) {
        delete this.store[key];
    }
}

global.localStorage = new LocalStorageMock();

const dummyProjectData = {
    project_data: {
        1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
        2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: false }
    }
};

global.window = window;

const projectDataString = localStorage.getItem('projectData');
if (!projectDataString) {
    localStorage.setItem('projectData', JSON.stringify(dummyProjectData));
} else {
    try {
        const projectData = JSON.parse(projectDataString);
        if (projectData && projectData.project_data) {
            // Use the validated projectData
        } else {
            // Handle invalid projectData
            console.error('Invalid project data in localStorage');
        }
    } catch (error) {
        console.error('Error parsing project data from localStorage:', error);
    }
}

// Function to render the projects list
function renderProjects() {
    const projectsList = document.querySelector('.projects');
    projectsList.innerHTML = '';

    const projectData = JSON.parse(localStorage.getItem('projectData')).project_data;
    for (const projectId in projectData) {
        if (Object.prototype.hasOwnProperty.call(projectData, projectId)) {
            let project = projectData[parseInt(projectId)];
            if (project.active) {
                const projectElement = createProjectElement(project, projectId);
                projectsList.appendChild(projectElement);
            }
        }
    }
}

// Function to create a project element
function createProjectElement(project, projectId) {
    const projectElement = document.createElement('li');

    const projectTitle = document.createElement('h3');
    projectTitle.textContent = project.projectName;
    projectElement.appendChild(projectTitle);

    const projectTag = document.createElement('p');
    projectTag.textContent = `Tag: ${project.projectTag}`;
    projectElement.appendChild(projectTag);

    const projectContributors = document.createElement('p');
    projectContributors.textContent = `Contributors: ${project.projectContributors}`;
    projectElement.appendChild(projectContributors);

    const projectDescription = document.createElement('p');
    projectDescription.textContent = `Description: ${project.projectDescription}`;
    projectElement.appendChild(projectDescription);

    const projectActions = document.createElement('div');
    projectActions.classList.add('project-actions');

    const archiveButton = document.createElement('button');
    archiveButton.textContent = 'Archive';
    archiveButton.classList.add('archive-btn');
    archiveButton.addEventListener('click', (event) => {
        event.stopPropagation();
        archiveProject(projectId);
    });
    projectActions.appendChild(archiveButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteProject(projectId);
    });
    projectActions.appendChild(deleteButton);

    projectElement.appendChild(projectActions);
    projectElement.addEventListener('click', () => {
        const projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('projectData'))));
        projectDataCopy.current_project = projectId;
        projectDataCopy.current_date = new Date().toLocaleDateString();
        localStorage.setItem('projectData', JSON.stringify(projectDataCopy));
        window.location.href = escape("../projectHomePage/project_home_page.html");
    });

    return projectElement;
}

// Function to archive a project
function archiveProject(projectId) {
    let projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('projectData'))));
    projectDataCopy.project_data[parseInt(projectId)].active = false;
    localStorage.setItem('projectData', JSON.stringify(projectDataCopy));
    renderProjects();
}

// Function to delete a project
function deleteProject(projectId) {
    let projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('projectData'))));
    delete projectDataCopy.project_data[parseInt(projectId)];
    localStorage.setItem('projectData', JSON.stringify(projectDataCopy));
    renderProjects();
}

// Tests
describe('Project Data Initialization', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should set dummy project data in localStorage if it is not present', () => {
        const dummyProjectData = { project_data: [] };
        // Initialize the projects data in localStorage
        const projectDataString = localStorage.getItem('projectData');
        if (!projectDataString) {
            localStorage.setItem('projectData', JSON.stringify(dummyProjectData));
        }

        expect(localStorage.getItem('projectData')).toEqual(JSON.stringify(dummyProjectData));
    });

    it('should handle invalid projectData in localStorage', () => {
        localStorage.setItem('projectData', 'invalid JSON string');
        console.error = jest.fn();

        try {
            const projectData = JSON.parse(localStorage.getItem('projectData'));
            if (projectData && projectData.project_data) {
                // Use the validated projectData
            } else {
                // Handle invalid projectData
                console.error('Invalid project data in localStorage');
            }
        } catch (error) {
            console.error('Error parsing project data from localStorage:', error);
        }

        expect(console.error).toHaveBeenCalledWith('Error parsing project data from localStorage:', expect.any(SyntaxError));
    });
});

describe('Render Projects', () => {
    beforeEach(() => {
        document.body.innerHTML = '<ul class="projects"></ul>';
        localStorage.clear();
    });

    it('should render active projects correctly', () => {
        const dummyProjectData = {
            project_data: {
                1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
                2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: false }
            }
        };
        localStorage.setItem('projectData', JSON.stringify(dummyProjectData));

        renderProjects();

        const projectsList = document.querySelector('.projects');
        expect(projectsList.children.length).toBe(1);
        expect(projectsList.children[0].querySelector('h3').textContent).toBe('Project 1');
    });
});

describe('Search Projects', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <ul class="projects">
                <li>
                    <h3>Project 1</h3>
                    <p>Tag: Tag1</p>
                    <p>Contributors: Alice</p>
                    <p>Description: Description 1</p>
                </li>
                <li>
                    <h3>Project 2</h3>
                    <p>Tag: Tag2</p>
                    <p>Contributors: Bob</p>
                    <p>Description: Description 2</p>
                </li>
            </ul>
        `;
    });

    it('should filter projects based on search term', () => {
        searchProjects('Project 1');

        const projectsList = document.querySelectorAll('.projects li');
        expect(projectsList[0].style.display).toBe('block');
        expect(projectsList[1].style.display).toBe('none');
    });

    it('should show all projects if search term is empty', () => {
        searchProjects('');

        const projectsList = document.querySelectorAll('.projects li');
        projectsList.forEach(projectElement => {
            expect(projectElement.style.display).toBe('block');
        });
    });
});