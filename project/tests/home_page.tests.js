// Import the functions
const {renderProjects, archiveProject, deleteProject} = require('../homePage/home_page');

const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
const { document } = window;

// Mock the global.localStorage
class localStorageMock {
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

global.localStorage = new localStorageMock();

const dummyProjectData = {
    project_data: {
        1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
        2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: false }
    }
};

global.window = window;

const projectDataString = global.localStorage.getItem('projectData');

if (!projectDataString) {
    global.localStorage.setItem('projectData', JSON.stringify(dummyProjectData));
} else {
    try {
        const projectData = JSON.parse(projectDataString);
        if (projectData && projectData.project_data) {
            // Use the validated projectData
        } else {
            // Handle invalid projectData
            console.error('Invalid project data in global.localStorage');
        }
    } catch (error) {
        console.error('Error parsing project data from global.localStorage:', error);
    }
}

describe('Project Data Initialization', () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    it('should set dummy project data in global.localStorage if it is not present', () => {
        const dummyProjectData = { project_data: [] };
        // Initialize the projects data in global.localStorage
        const projectDataString = global.localStorage.getItem('projectData');
        if (!projectDataString) {
            global.localStorage.setItem('projectData', JSON.stringify(dummyProjectData));
        }

        expect(global.localStorage.getItem('projectData')).toEqual(JSON.stringify(dummyProjectData));
    });

    it('should handle invalid projectData in global.localStorage', () => {
        global.localStorage.setItem('projectData', 'invalid JSON string');
        console.error = jest.fn();

        try {
            const projectData = JSON.parse(global.localStorage.getItem('projectData'));
            if (projectData && projectData.project_data) {
                // Use the validated projectData
            } else {
                // Handle invalid projectData
                console.error('Invalid project data in global.localStorage');
            }
        } catch (error) {
            console.error('Error parsing project data from global.localStorage:', error);
        }

        expect(console.error).toHaveBeenCalledWith('Error parsing project data from global.localStorage:', expect.any(SyntaxError));
    });
});

describe('Render Projects', () => {
    beforeEach(() => {
        document.body.innerHTML = '<ul class="projects"></ul>';
        global.localStorage.clear();
        global.localStorage.setItem('projectData', JSON.stringify(dummyProjectData));
    });

    it('should render active projects correctly', () => {
        renderProjects();

        const projectsList = document.querySelector('.projects');
        expect(projectsList.children.length).toBe(1);
        expect(projectsList.children[0].querySelector('h3').textContent).toBe('Project 1');
    });
});

describe('Archive Project', () => {
    beforeEach(() => {
        global.localStorage.clear();
        global.localStorage.setItem('projectData', JSON.stringify(dummyProjectData));
        document.body.innerHTML = '<ul class="projects"></ul>';
        renderProjects();
    });

    it('should archive the project correctly', () => {
        archiveProject(1);

        const projectDataCopy = JSON.parse(global.localStorage.getItem('projectData'));
        expect(projectDataCopy.project_data[1].active).toBe(false);

        const projectsList = document.querySelector('.projects');
        expect(projectsList.children.length).toBe(0);
    });
});

describe('Delete Project', () => {
    beforeEach(() => {
        global.localStorage.clear();
        global.localStorage.setItem('projectData', JSON.stringify(dummyProjectData));
        document.body.innerHTML = '<ul class="projects"></ul>';
        renderProjects();
    });

    it('should delete the project correctly', () => {
        deleteProject(1);

        const projectDataCopy = JSON.parse(global.localStorage.getItem('projectData'));
        expect(projectDataCopy.project_data[1]).toBeUndefined();

        const projectsList = document.querySelector('.projects');
        expect(projectsList.children.length).toBe(0);
    });
});