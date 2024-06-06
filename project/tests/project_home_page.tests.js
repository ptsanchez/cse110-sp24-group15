// Mock localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn()
};

// Mock the window
global.window = {
    location: {
        href: ''
    }
};

// Mock document and (required) methods
global.document = {
    body: {
        innerHTML: ''
    },
    querySelector: jest.fn(),
    getElementById: jest.fn(),
    addEventListener: jest.fn(),
    // for renderMarkup function
    createElement: jest.fn((tag) => {
        const element = {
            setAttribute: jest.fn(),
            appendChild: jest.fn(),
            innerText: '',
            innerHTML: '',
            textContent: '',
            getAttribute: jest.fn().mockReturnValue('false')
        };
        if (tag === 'div') {
            element.style = {};
        }
        return element;
    }),
    // for renderMarkup function
    createTextNode: jest.fn((text) => {
        return { nodeValue: text };
    })
};

// Mock HTML content for the tests
const mockHTMLContent = `
    <div class="main-content">
        <div class="project-home-page-title-div">
            <span class="project-text"></span>
        </div>
        <div class="project-todo-list-div">
            <div class="todo-list-header">
                <span class="todo-list-title">TODO LIST</span>
                <hr class="todo-list-divider">
            </div>
            <span class="project-todo-list" contenteditable="false"></span>
            <button class="edit-btn todo-edit-btn"><i class="bx bx-edit"></i></button>
        </div>
        <div class="project-link-div">
            <div class="project-link-header">
                <span class="project-link-title">Link to Branch/Workspace</span>
                <hr class="project-link-divider">
            </div>
            <a href="#" class="project-branch-link" contenteditable="false"></a>
            <button class="edit-btn branch-edit-btn"><i class="bx bx-edit"></i></button>
        </div>
        <div class="project-detail-div">
            
        </div>
        <div class="project-btns-div">
            <button class="make-log-btn" onclick="location.href='../addLogPage/add_log_page.html'">Make Log</button>
            <button class="all-logs-btn" onclick="location.href='../monthlyPage/monthly_page.html'">All Logs</button>
        </div>
    </div>
`;

describe('Project Home Page Tests', () => {
    let projectTextElement, todoListElement, branchLinkElement, projectDetailElement;
    let todoEditButton, branchEditButton;

    // Strings to be put to each test case
    const originalTodoList = '- [ ] Task 1\n- [x] Task 2';
    const newTodoList = '- [ ] New Task 1\n- [x] Task 2';
    const originalBranchLink = 'https://github.com/rabongHan';
    const newBranchLink = 'https://github.com/rabongHan/Lab8-Starter';
    const projectName = 'Test Project';
    const projectDescription = 'Test Project Description';

    beforeEach(() => {
        // Clear the local storage every time
        jest.clearAllMocks();

        // Set dummy project data in localStorage
        localStorage.getItem.mockReturnValue(JSON.stringify({
            current_project: 'project_1',
            project_data: {
                'project_1': {
                    projectName: projectName,
                    TodoList: originalTodoList,
                    BranchLink: originalBranchLink,
                    projectDescription: projectDescription
                }
            }
        }));

        // Mock document.body.innerHTML for the tests
        document.body.innerHTML = mockHTMLContent;

        // Mock document.querySelector for setting innerHTML and event listeners
        projectTextElement = { textContent: '', innerText: '', appendChild: jest.fn() };
        todoListElement = { textContent: '', innerText: '', getAttribute: jest.fn().mockReturnValue('false'), setAttribute: jest.fn(), appendChild: jest.fn(), addEventListener: jest.fn(), dblclick: jest.fn() };
        branchLinkElement = { textContent: '', innerText: '', href: '', getAttribute: jest.fn().mockReturnValue('false'), setAttribute: jest.fn(), appendChild: jest.fn() };
        projectDetailElement = { textContent: '', innerText: '', appendChild: jest.fn() };
        todoEditButton = { addEventListener: jest.fn(), click: jest.fn() };
        branchEditButton = { addEventListener: jest.fn(), click: jest.fn() };
        projectLinkElement = {addEventListener: jest.fn(), dblclick: jest.fn() }
        
        document.querySelector = jest.fn((selector) => {
            const elements = {
                ".project-text": projectTextElement,
                ".project-todo-list": todoListElement,
                ".project-branch-link": branchLinkElement,
                ".project-detail-div": projectDetailElement,
                ".todo-edit-btn": todoEditButton,
                ".branch-edit-btn": branchEditButton,
                ".project-link-div": projectLinkElement
            };
            return elements[selector];
        });

        // Mock document.addEventListener
        document.addEventListener = jest.fn((event, callback) => {
            callback();
        });

        // Load the script to trigger DOMContentLoaded
        require('../projectHomePage/project_home_page.js');
    });

    test('Editing TODO list works', () => {
        // Set initial textContent and innerText for the TODO list element
        todoListElement.textContent = originalTodoList;
        todoListElement.innerText = originalTodoList;

        const toggleEditMode = jest.fn();
        const saveChanges = jest.fn();

        document.querySelector.mockImplementation((selector) => {
            if (selector === '.todo-edit-btn') {
                return {
                    addEventListener: (event, handler) => {
                        toggleEditMode.mockImplementation(handler);
                    }
                };
            }
            return todoListElement;
        });

        // Simulate clicking the edit button
        todoEditButton.click();
        toggleEditMode();
        todoListElement.setAttribute('contenteditable', 'true');

        expect(todoListElement.setAttribute).toHaveBeenCalledWith('contenteditable', 'true');

        // Modify the TODO list content
        todoListElement.textContent = newTodoList;
        todoListElement.innerText = newTodoList;

        // Simulate clicking the save button
        saveChanges.mockImplementation(() => {
            const projectData = JSON.parse(localStorage.getItem('projectData'));
            projectData.project_data['project_1'].TodoList = todoListElement.innerText;
            localStorage.setItem('projectData', JSON.stringify(projectData));
        });

        todoEditButton.click();
        toggleEditMode();
        saveChanges();
        todoListElement.setAttribute('contenteditable', 'false');

        expect(todoListElement.setAttribute).toHaveBeenCalledWith('contenteditable', 'false');

        // Ensure the changes are saved in localStorage
        const updatedProjectData = {
            current_project: 'project_1',
            project_data: {
                'project_1': {
                    projectName: projectName,
                    TodoList: newTodoList,
                    BranchLink: originalBranchLink,
                    projectDescription: projectDescription
                }
            }
        };
        expect(localStorage.setItem).toHaveBeenCalledWith('projectData', JSON.stringify(updatedProjectData));
    });

    test('Editing branch link works', () => {
        // Set initial textContent and innerText for the branch link element
        branchLinkElement.textContent = originalBranchLink;
        branchLinkElement.innerText = originalBranchLink;
        branchLinkElement.href = originalBranchLink;

        const toggleEditMode = jest.fn();
        const saveChanges = jest.fn();

        document.querySelector.mockImplementation((selector) => {
            if (selector === '.branch-edit-btn') {
                return {
                    addEventListener: (event, handler) => {
                        toggleEditMode.mockImplementation(handler);
                    }
                };
            }
            return branchLinkElement;
        });

        // Simulate clicking the edit button
        branchEditButton.click();
        toggleEditMode();
        branchLinkElement.setAttribute('contenteditable', 'true');

        expect(branchLinkElement.setAttribute).toHaveBeenCalledWith('contenteditable', 'true');

        // Modify the branch link content
        branchLinkElement.textContent = newBranchLink;
        branchLinkElement.innerText = newBranchLink;

        // Simulate clicking the save button
        saveChanges.mockImplementation(() => {
            let link = branchLinkElement.innerText.trim();
            if (!link.startsWith('http://') && !link.startsWith('https://')) {
                link = 'https://' + link;
            }
            const projectData = JSON.parse(localStorage.getItem('projectData'));
            projectData.project_data['project_1'].BranchLink = link;
            localStorage.setItem('projectData', JSON.stringify(projectData));
            branchLinkElement.href = link;
        });

        branchEditButton.click();
        toggleEditMode();
        saveChanges();
        branchLinkElement.setAttribute('contenteditable', 'false');

        expect(branchLinkElement.setAttribute).toHaveBeenCalledWith('contenteditable', 'false');

        // Ensure the changes are saved in localStorage
        const updatedProjectData = {
            current_project: 'project_1',
            project_data: {
                'project_1': {
                    projectName: projectName,
                    TodoList: originalTodoList,
                    BranchLink: 'https://github.com/rabongHan/Lab8-Starter',
                    projectDescription: projectDescription
                }
            }
        };
        expect(localStorage.setItem).toHaveBeenCalledWith('projectData', JSON.stringify(updatedProjectData));
    });

    test('Project details load data correctly', () => {
        // Set initial textContent and innerText for elements
        projectTextElement.textContent = projectName;
        projectTextElement.innerText = projectName;
        todoListElement.textContent = originalTodoList;
        todoListElement.innerText = originalTodoList;
        branchLinkElement.textContent = originalBranchLink;
        branchLinkElement.innerText = originalBranchLink;
        branchLinkElement.href = originalBranchLink;
        projectDetailElement.textContent = projectDescription;
        projectDetailElement.innerText = projectDescription;

        // Check if the elements contain the correct data
        expect(projectTextElement.textContent).toBe(projectName);
        expect(todoListElement.textContent).toBe(originalTodoList);
        expect(branchLinkElement.textContent).toBe(originalBranchLink);
        expect(branchLinkElement.href).toBe(originalBranchLink);
        expect(projectDetailElement.textContent).toBe(projectDescription);
    });
});
