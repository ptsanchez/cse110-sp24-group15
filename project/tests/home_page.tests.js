const { renderProjects, archiveProject,  deleteProject} = require('../homePage/home_page'); 

let mockHTMLContent = `<!DOCTYPE html>
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

var dummyProjectData = {
    project_data: {
        1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
        2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: false }
    }
};

describe('Tests for Home Page', () => {
    beforeEach(() => {
        // Clear the local storage every time
        jest.clearAllMocks();

        // Set dummy project data in localStorage
        localStorage.getItem.mockReturnValue("project-data", JSON.stringify(dummyProjectData));

        // Mock document.body.innerHTML for the tests
        document.body.innerHTML = mockHTMLContent;

        let proj = {textContent: '', innerText: '', appendChild: jest.fn()};

        document.querySelector = jest.fn((selector) => {
            const elements = {
                ".projects": proj,
            };
            return elements[selector];
        });

        // Mock document.addEventListener
        document.addEventListener = jest.fn((event, callback) => {
            callback();
        });

        // Load the script to trigger DOMContentLoaded
        require('../homePage/home_page.js');
    });

    test("Render Page", () => {
        renderProjects();

        let project = document.querySelector('.projects')[0];

        console.log(project);
    });

});