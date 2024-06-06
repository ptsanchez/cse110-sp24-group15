const { renderProjects, archiveProject,  deleteProject} = require('../feedbackPage/feedback_page'); 

// Mock the alert function
global.alert = jest.fn();

// Mock the localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
};

// Mock the window.location.href
global.window = {
    location: { href: '' }
};

global.dummyProjectData = {
    project_data: {
        1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
        2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: false }
    }
};

// Mock the document.getElementById
global.document = {
    getElementById: jest.fn((id) => {
        const elements = {};
        return elements[id];
    }),
    querySelectorAll: jest.fn((selector) => {
        // Mock the querySelectorAll for radio buttons
        if (selector === 'input[type="radio"]:checked') {
            return [];
        }
        return [];
    })
};

describe('Project Data Initialization', () => {
    beforeEach(() => {
        
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
            let projectData = JSON.parse(localStorage.getItem('projectData'));
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
        jest.clearAllMocks();
        // Mock localStorage to return an empty array when 'feedback_submissions' is requested
        localStorage.getItem.mockReturnValue(JSON.stringify(dummyProjectData));
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