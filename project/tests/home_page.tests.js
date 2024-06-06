const { JSDOM } = require('jsdom');

// Mock localStorage
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


let mockHTMLContents = `<!DOCTYPE html>
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

// Mock DOM
const dom = new JSDOM(mockHTMLContents);
global.document = dom.window.document;

const { renderProjects, archiveProject, deleteProject } = require('../homePage/home_page.js'); 

describe('Project Management', () => {
    beforeEach(() => {
        localStorage.clear();
        document.querySelector('.projects').innerHTML = '';
    });

    test('should render active projects', () => {
        const projectData = {
                1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
                2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: false },
                3: { projectName: 'Project 3', projectTag: 'Tag3', projectContributors: 'Charlie', projectDescription: 'Description 3', active: true }
        };

        localStorage.setItem('project-data', JSON.stringify(projectData));
        renderProjects();

        const projectsList = document.querySelectorAll('.projects li');
        expect(projectsList.length).toBe(2);
        expect(projectsList[0].querySelector('h3').textContent).toBe('Project 1');
        expect(projectsList[1].querySelector('h3').textContent).toBe('Project 3');
    });

    test('should archive a project', () => {
        const projectData = {
            project_data: {
                1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true }
            }
        };

        localStorage.setItem('project-data', JSON.stringify(projectData));
        archiveProject(1);

        const storedData = JSON.parse(localStorage.getItem('project-data'));
        expect(storedData.project_data[1].active).toBe(false);
    });

    test('should delete a project', () => {
        const projectData = {
            project_data: {
                1: { projectName: 'Project 1', projectTag: 'Tag1', projectContributors: 'Alice', projectDescription: 'Description 1', active: true },
                2: { projectName: 'Project 2', projectTag: 'Tag2', projectContributors: 'Bob', projectDescription: 'Description 2', active: true }
            }
        };

        localStorage.setItem('project-data', JSON.stringify(projectData));
        deleteProject(1);

        const storedData = JSON.parse(localStorage.getItem('project-data'));
        expect(storedData.project_data[1]).toBeUndefined();
        expect(storedData.project_data[2]).toBeDefined();
    });
});
