const puppeteer = require('puppeteer');

// set test time to be 50000ms
jest.setTimeout(50000);

describe('Developer Journal Flow', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 20
          });
        page = await browser.newPage();

        // set the screen resolution to 1728x1127
        await page.setViewport({ width: 1728, height: 1117 });

        // go to our github page for developer journal (deployed)
        await page.goto('https://cse110-sp24-group15.github.io/cse110-sp24-group15/project/homePage/home_page.html');
    });

    afterAll(async () => {
        await browser.close();
    });
    
    // Test 1 
    it('Create 4 projects', async () => {
        // create 4 projects; each has name of "project n", contributor of "contributor n", and description of "description n"
        for (let i = 1; i <= 4; i++) {
            await page.click('.add-project-btn'); 
            await page.waitForSelector('#add-project-form');

            await page.type('#project-name', `Project ${i}`);
            await page.select('#project-tag', 'development');
            await page.type('#project-contributor', `Contributor ${i}`);
            await page.type('#project-description', `Description for Project ${i}`);

            await page.click('.submit-btn');

        }

        // Check the number of projects after creation
        const projects = await page.$$eval('.projects li', items => items.length);
        expect(projects).toBe(4);

        // Check local storage just in case for e2e test error
        const localStorageData = await page.evaluate(() => localStorage.getItem('project_data'));
        const projectData = JSON.parse(localStorageData)['project_data'];
        const projectCount = Object.keys(projectData).length;
        expect(projectCount).toBe(4);
    });

    // Test 2
    it('Archive 2 projects and check archive page', async () => {
        // Archive Project 1 and Project 2
        for (let i = 1; i <= 2; i++) {
            const project = await page.$(`.projects li:nth-child(1)`);
            const archiveButton = await project.$('.archive-btn');
            await archiveButton.click();
        }
      
        // Navigate to the archive page
        await page.click('.archive-page-btn');
    
        // Check the number of archived projects on the archive page
        const archivedProjects = await page.$$eval('.project-list li', items => items.length);
        expect(archivedProjects).toBe(2);
    });

    // Test 3
    it('Check if search works on archive page', async () => {
        // Type into the search bar
        await page.type('#search-bar', 'Project 1');
    
        // Check the number of visible projects
        const visibleProjects1 = await page.$$eval('.project-list li', items => items.length);
        expect(visibleProjects1).toBe(1);
    
        // Check that the visible project has the correct name
        const projectName1 = await page.$eval('.project-list li span', el => el.textContent);
        expect(projectName1).toBe('Project 1');

        // Delete the text in search bar
        await page.click('#search-bar');
        for (let i = 0; i <= 8; i++) {
            await page.keyboard.press('Backspace'); 
        }

        // Type into the search bar and check for Project 2
        await page.type('#search-bar', 'Project 2');

        // Check the number of visible projects for Project 2
        const visibleProjects2 = await page.$$eval('.project-list li', items => items.length);
        expect(visibleProjects2).toBe(1);

        // Check that the visible project has the correct name for Project 2
        const projectName2 = await page.$eval('.project-list li span', el => el.textContent);
        expect(projectName2).toBe('Project 2');
    });

    // Test 3
    it('Check if search works on home page', async () => {
        // Navigate back to the home page (first nav button is home page button)
        await page.click('nav .nav-button:first-of-type'); 

        // Type into the search bar and check for Project 3
        await page.type('.search', 'Project 3');

        // Check the number of visible projects for Project 3
        const visibleProjects3 = await page.$$eval('.projects li', items => items.filter(item => item.style.display !== 'none').length);
        expect(visibleProjects3).toBe(1);

        // Check that the visible project has the correct name for Project 3
        const projectName3 = await page.$eval('.projects li .project-title', el => el.textContent);
        expect(projectName3).toBe('Project 3');

        // Clear the search bar for next test
        await page.click('.search');
        for (let i = 0; i <= 8; i++) {
            await page.keyboard.press('Backspace'); 
        }
    });

    // Test 4
    it('Edit TODO list and branch link of a project', async () => {
        // Click on the project to navigate to the project home page
        await page.click('.projects li:nth-child(1)'); // Click on the first project

        // Edit the TODO list
        const todoEditButton = await page.$('.todo-edit-btn');
        await todoEditButton.click();
        const todoList = await page.$('.project-todo-list');
        await todoList.click({ clickCount: 3 });
        
        // Delete the default text in todolist 
        for (let i = 0; i <= 28; i++) {
            await page.keyboard.press('Backspace'); 
        }

        // Type new text in todolist
        await page.type('.project-todo-list', 'New TODO item');

        // Save the TODO list
        await todoEditButton.click();

        // Edit the branch link
        const branchEditButton = await page.$('.branch-edit-btn');
        await branchEditButton.click();
        const branchLink = await page.$('.project-branch-link');
        await branchLink.click({ clickCount: 3 });

        // Delete the default text in branchlink
        for (let i = 0; i <= 44; i++) {
            await page.keyboard.press('Backspace'); 
        }

        // Type new text in branch link
        await page.type('.project-branch-link', 'https://newbranchlink.com');

        // Save the branch link
        await branchEditButton.click();

        // Verify the changes
        let savedTodoList = await page.$eval('.project-todo-list', el => el.textContent.trim());
        expect(savedTodoList).toBe('New TODO item');

        let savedBranchLink = await page.$eval('.project-branch-link', el => el.textContent.trim());
        expect(savedBranchLink).toBe('https://newbranchlink.com');
    });

    // Test 5
    it('TODO list and branch link is loaded correctly after revisiting site; save is maintained', async () => {
        await page.reload();
        
        // Verify the changes after reloading the page
        let savedTodoList = await page.$eval('.project-todo-list', el => el.textContent.trim());
        expect(savedTodoList).toBe('New TODO item');

        let savedBranchLink = await page.$eval('.project-branch-link', el => el.textContent.trim());
        expect(savedBranchLink).toBe('https://newbranchlink.com');

        // Navigate back to the home page and come back to project page
        await page.click('nav .nav-button:first-of-type');
        await page.reload();
        await page.click('.projects li:nth-child(1)');

        // Verify the changes 
        savedTodoList = await page.$eval('.project-todo-list', el => el.textContent.trim());
        expect(savedTodoList).toBe('New TODO item');

        savedBranchLink = await page.$eval('.project-branch-link', el => el.textContent.trim());
        expect(savedBranchLink).toBe('https://newbranchlink.com');
    });
});