const { JSDOM } = require('jsdom');
const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
const { document } = window;

const { renderProjects, archiveProject,  deleteProject} = require('../homePage/home_page'); 

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