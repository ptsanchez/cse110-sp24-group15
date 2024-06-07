// Import necessary modules for Jest testing
const { JSDOM } = require('jsdom');

// Import functions to be tested
const { searchProjects, deleteProject, archiveProject, renderProjects } = require('../homePage/home_page');

// Define a mock project data to use for testing
const mockProjectData = {
    project_data: {
        "1": {
            projectName: "Project 1",
            projectTag: "Tag 1",
            projectContributors: "Contributor 1",
            projectDescription: "Description 1",
            active: true
        },
        "2": {
            projectName: "Project 2",
            projectTag: "Tag 2",
            projectContributors: "Contributor 2",
            projectDescription: "Description 2",
            active: true
        },
        // Add more mock projects as needed
    }
};

// Mock localStorage
global.localStorage = {
    getItem: jest.fn().mockReturnValue(JSON.stringify(mockProjectData)),
    setItem: jest.fn()
};

// Define a mock DOM structure
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Home Page</title>
</head>
<body>
    <main>
        <div class="project-list">
            <ul class="projects">
                <li>
                    <h3>Project 1</h3>
                    <p>Tag: Tag 1</p>
                    <p>Contributors: Contributor 1</p>
                    <p>Description: Description 1</p>
                    <div class="project-actions">
                        <button class="archive-btn">Archive</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                </li>
                <li>
                    <h3>Project 2</h3>
                    <p>Tag: Tag 2</p>
                    <p>Contributors: Contributor 2</p>
                    <p>Description: Description 2</p>
                    <div class="project-actions">
                        <button class="archive-btn">Archive</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                </li>
            </ul>
        </div>
    </main>
</body>
</html>
`;

// Create a new JSDOM instance
const dom = new JSDOM(htmlContent, { runScripts: "dangerously" });
const { window } = dom;
const { document } = window;

// Mock the necessary functions for DOM manipulation
window.document.querySelectorAll = jest.fn((selector) => {
    if (selector === '.projects li') {
        return document.querySelectorAll('.projects li');
    }
});

// Begin writing tests
describe('Home Page Functions', () => {
    describe('searchProjects', () => {
        test('should filter projects based on search term', () => {
            // Mock input value for search term
            const searchTerm = "Project 1";

            // Call the search function
            searchProjects(searchTerm);

            // Assert that only Project 1 is displayed
            const projectsList = document.querySelectorAll('.projects li');
            expect(projectsList.length).toBe(1);
            expect(projectsList[0].querySelector('h3').textContent).toBe("Project 1");
        });
    });

    describe('deleteProject', () => {
        test('should delete a project from localStorage', () => {
            // Mock event and projectId
            const mockEvent = { stopPropagation: jest.fn() };
            const projectId = "1";

            // Call the delete function
            deleteProject(projectId);

            // Assert that localStorage.setItem is called with updated project data
            expect(localStorage.setItem).toHaveBeenCalledWith('project_data', JSON.stringify({
                project_data: {
                    "2": {
                        projectName: "Project 2",
                        projectTag: "Tag 2",
                        projectContributors: "Contributor 2",
                        projectDescription: "Description 2",
                        active: true
                    }
                }
            }));
        });
    });

    describe('archiveProject', () => {
        test('should archive a project', () => {
            // Mock projectId
            const projectId = "1";

            // Call the archive function
            archiveProject(projectId);

            // Assert that localStorage.setItem is called with updated project data
            expect(localStorage.setItem).toHaveBeenCalledWith('project_data', JSON.stringify({
                project_data: {
                    "1": {
                        projectName: "Project 1",
                        projectTag: "Tag 1",
                        projectContributors: "Contributor 1",
                        projectDescription: "Description 1",
                        active: false
                    },
                    "2": {
                        projectName: "Project 2",
                        projectTag: "Tag 2",
                        projectContributors: "Contributor 2",
                        projectDescription: "Description 2",
                        active: true
                    }
                }
            }));
        });
    });

    describe('renderProjects', () => {
        test('should render projects from localStorage', () => {
            // Call the render function
            renderProjects();

            // Assert that projects are rendered correctly
            const projectsList = document.querySelectorAll('.projects li');
            expect(projectsList.length).toBe(2);
            expect(projectsList[0].querySelector('h3').textContent).toBe("Project 1");
            expect(projectsList[1].querySelector('h3').textContent).toBe("Project 2");
        });
    });
});
