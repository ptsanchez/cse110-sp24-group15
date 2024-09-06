// Import the functions
const { initializeProjectData, updateProjectData, submissionLogic } = require('../addProjectPage/add_project_page');

describe('Initialize JSON string to be set in local storage', () => {
    it('should be initialized correctly when local storage string does not exist', () => {
        const formObj = {
            'project-name': 'Test Project 1',
            'project-tag': 'development',
            'project-contributor': 'Test person 1',
            'project-description': 'Test description 1'
        };
        const result = initializeProjectData(formObj);
        const expected = JSON.stringify({
            current_project: '',
            current_date: (new Date()).toLocaleDateString(),
            project_data: {
                project_1: {
                    projectName: 'Test Project 1',
                    projectTag: 'development',
                    projectContributors: 'Test person 1',
                    projectDescription: 'Test description 1',
                    active: true,
                    logs: [],
                    BranchLink: '',
                    TodoList: {}
                }
            }
        });
        expect(result).toBe(expected);
    });
});

describe('Update JSON string to be set in local storage', () => {
    it('should be updated correctly when local storage string exists', () => {
        const formObj = {
            'project-name': 'Test Project 2',
            'project-tag': 'design',
            'project-contributor': 'Test person 2',
            'project-description': 'Test description 2'
        };
        const localStr = JSON.stringify({
            current_project: '',
            current_date: '05/30/2024',
            project_data: {
                project_1: {
                    projectName: 'Test Project 1',
                    projectTag: 'development',
                    projectContributors: 'Test person 1',
                    projectDescription: 'Test description 1',
                    active: true,
                    logs: [],
                    BranchLink: '',
                    TodoList: {}
                }
            }
        });
        const result = updateProjectData(formObj, localStr);
        const expected = JSON.stringify({
            current_project: '',
            current_date: '05/30/2024',
            project_data: {
                project_1: {
                    projectName: 'Test Project 1',
                    projectTag: 'development',
                    projectContributors: 'Test person 1',
                    projectDescription: 'Test description 1',
                    active: true,
                    logs: [],
                    BranchLink: '',
                    TodoList: {}
                },
                project_2: {
                    projectName: 'Test Project 2',
                    projectTag: 'design',
                    projectContributors: 'Test person 2',
                    projectDescription: 'Test description 2',
                    active: true,
                    logs: [],
                    BranchLink: '',
                    TodoList: {}
                }
            }
        });
        expect(result).toBe(expected);
    });
});

describe('Form Submission Handler Logic', () => {
    it('should handle form submission and update local storage correctly', () => {
        const formObj = {
            'project-name': 'Test Project 3',
            'project-tag': 'personal',
            'project-contributor': 'Test person 3',
            'project-description': 'Test description 3'
        };

        const mockGetItem = jest.fn().mockReturnValueOnce(null); // Simulate empty local storage
        const mockSetItem = jest.fn();

        submissionLogic(formObj, mockGetItem, mockSetItem);

        const expectedData = JSON.stringify({
            current_project: '',
            current_date: (new Date()).toLocaleDateString(),
            project_data: {
                project_1: {
                    projectName: 'Test Project 3',
                    projectTag: 'personal',
                    projectContributors: 'Test person 3',
                    projectDescription: 'Test description 3',
                    active: true,
                    logs: [],
                    BranchLink: '',
                    TodoList: {}
                }
            }
        });

        expect(mockSetItem).toHaveBeenCalledWith('project_data', expectedData);
    });
});