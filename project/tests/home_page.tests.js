const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Load the HTML content from the home_page.html file
const htmlFilePath = path.resolve(__dirname, '../homePage/home_page.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

// Create a JSDOM instance with the HTML content
const dom = new JSDOM(htmlContent);
const { window } = dom;
const { document } = window;

// Mock the necessary functions for DOM manipulation
global.document = document;

// Import functions to be tested
const { searchProjects, deleteProject, archiveProject, renderProjects } = require('../homePage/home_page.js');

// Mock localStorage
global.localStorage = {
    getItem: jest.fn().mockReturnValue(JSON.stringify({
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
    })),
    setItem: jest.fn()
};

describe('Home Page Functions', () => {
    describe('searchProjects', () => {
        test('should filter projects based on search term', () => {
            document.querySelectorAll = jest.fn().mockReturnValue([
                { querySelector: jest.fn().mockReturnValue({ textContent: 'Project 1' }) },
                { querySelector: jest.fn().mockReturnValue({ textContent: 'Project 2' }) }
            ]);

            searchProjects('Project 1');

            expect(document.querySelectorAll).toHaveBeenCalledWith('.projects li');
            expect(document.querySelectorAll.mock.calls.length).toBe(1);

            expect(document.querySelectorAll('.projects li')[0].style.display).toBe('block');
            expect(document.querySelectorAll('.projects li')[1].style.display).toBe('none');
        });
    });

    describe('deleteProject', () => {
        test('should delete a project from localStorage', () => {
            const mockEvent = { stopPropagation: jest.fn() };

            deleteProject("1");

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
            archiveProject("1");

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
            renderProjects();

            expect(document.querySelectorAll('.projects li').length).toBe(2);
            expect(document.querySelectorAll('.projects li')[0].querySelector('h3').textContent).toBe('Project 1');
            expect(document.querySelectorAll('.projects li')[1].querySelector('h3').textContent).toBe('Project 2');
        });
    });
});
