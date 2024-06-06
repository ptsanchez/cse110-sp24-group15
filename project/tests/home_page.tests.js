const { JSDOM } = require('jsdom');

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

// Mock the global window object
global.window = {
    location: {
      href: ''
    }
};


// Mock the document.querySelector
global.document = {
    querySelector: jest.fn((selector) => {
      const elements = {
        "#log-title": { value: 'Sample Title' },
        "#log-time": { value: '12:00' },
        "#log-contributor": { value: 'John Doe' },
        "#log-description": { value: 'Sample Description' },
      };
      return elements[selector];
    })
};

global.localStorage = new LocalStorageMock();

// Initialize the projects data in localStorage
const dummyProjectData = {
    project_data: {
        1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
        2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: false }
    }
};

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

describe('Create Project Element', () => {
    it('should create a project element with correct data', () => {
        const project = {
            projectName: 'Project 1',
            projectTag: 'Tag1',
            projectContributors: 'Alice',
            projectDescription: 'Description 1',
            active: true
        };

        const projectId = 1;
        const projectElement = createProjectElement(project, projectId);

        expect(projectElement.querySelector('h3').textContent).toBe('Project 1');
        expect(projectElement.querySelector('p').textContent).toBe('Tag: Tag1');
        expect(projectElement.querySelector('.archive-btn')).not.toBeNull();
        expect(projectElement.querySelector('.delete-btn')).not.toBeNull();
    });
});

describe('Archive Project', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should archive the project correctly', () => {
        const dummyProjectData = {
            project_data: {
                1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true }
            }
        };
        localStorage.setItem('projectData', JSON.stringify(dummyProjectData));

        archiveProject(1);

        const projectDataCopy = JSON.parse(localStorage.getItem('projectData'));
        expect(projectDataCopy.project_data[1].active).toBe(false);
    });
});

describe('Delete Project', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should delete the project correctly', () => {
        const dummyProjectData = {
            project_data: {
                1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true }
            }
        };
        localStorage.setItem('projectData', JSON.stringify(dummyProjectData));

        deleteProject(1);

        const projectDataCopy = JSON.parse(localStorage.getItem('projectData'));
        expect(projectDataCopy.project_data[1]).toBeUndefined();
    });
});
