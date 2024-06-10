const puppeteer = require('puppeteer');

// set test time to be 50000ms
jest.setTimeout(50000);

describe('Developer Journal Flow', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true, // headless mode for Github action 
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 10
        });
        page = await browser.newPage();

        // set the screen resolution to 1728x1117
        await page.setViewport({ width: 1728, height: 1117 });

        // go to our github page for developer journal (deployed)
        await page.goto('https://cse110-sp24-group15.github.io/cse110-sp24-group15/project/homePage/home_page.html');
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    // Helper function to delete text
    const clearText = async (element, length) => {
        for (let i = 0; i < length; i++) {
            await element.press('Backspace');
        }
    };

    // Helper function to add delay
    function delay(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time);
        });
    }

    function getTodayDate() {
        const today = new Date().toLocaleDateString(`en-CA`);
        return today;
    }

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
            await delay(500); // Add delay for stability
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
            await page.waitForSelector(`.projects li:nth-child(1)`);
            const project = await page.$(`.projects li:nth-child(1)`);
            const archiveButton = await project.$('.archive-btn');
            await archiveButton.click();
            await delay(500); // Add delay for stability
        }

        // Navigate to the archive page
        await page.click('.archive-page-btn');
        await page.waitForSelector('.project-list li'); // Wait for the projects to appear

        // Check the number of archived projects on the archive page
        const archivedProjects = await page.$$eval('.project-list li', items => items.length);
        expect(archivedProjects).toBe(2);
    });

    // Test 3
    it('Check if search works on archive page', async () => {
        // Type into the search bar
        await page.type('#search-bar', 'Project 1');
        await delay(500); // Add delay for stability

        // Check the number of visible projects
        const visibleProjects1 = await page.$$eval('.project-list li', items => items.length);
        expect(visibleProjects1).toBe(1);

        // Check that the visible project has the correct name
        const projectName1 = await page.$eval('.project-list li span', el => el.textContent);
        expect(projectName1).toBe('Project 1');

        // Delete the text in search bar
        await page.click('#search-bar');
        await clearText(page.keyboard, 9);

        // Type into the search bar and check for Project 2
        await page.type('#search-bar', 'Project 2');
        await delay(500); // Add delay for stability

        // Check the number of visible projects for Project 2
        const visibleProjects2 = await page.$$eval('.project-list li', items => items.length);
        expect(visibleProjects2).toBe(1);

        // Check that the visible project has the correct name for Project 2
        const projectName2 = await page.$eval('.project-list li span', el => el.textContent);
        expect(projectName2).toBe('Project 2');
    });

    // Test 4
    it('Check if search works on home page', async () => {
        // Navigate back to the home page (first nav button is home page button)
        await page.click('nav .nav-button:first-of-type');
        await page.waitForSelector('.projects li'); // Wait for the projects to appear

        // Type into the search bar and check for Project 3
        await page.type('.search', 'Project 3');
        await delay(500); // Add delay for stability

        // Check the number of visible projects for Project 3
        const visibleProjects3 = await page.$$eval('.projects li', items => items.filter(item => item.style.display !== 'none').length);
        expect(visibleProjects3).toBe(1);

        // Check that the visible project has the correct name for Project 3
        const projectName3 = await page.$eval('.projects li .project-title', el => el.textContent);
        expect(projectName3).toBe('Project 3');

        // Clear the search bar for next test
        await page.click('.search');
        await clearText(page.keyboard, 9);
    });

    // Test 5
    it('Edit TODO list and branch link of a project', async () => {
        // Click on the project to navigate to the project home page
        await page.click('.projects li:nth-child(1)');
        await page.waitForSelector('.project-todo-list'); // Wait for the project details to appear

        // Edit the TODO list
        const todoEditButton = await page.$('.todo-edit-btn');
        await todoEditButton.click();
        const todoList = await page.$('.project-todo-list');
        await todoList.click({ clickCount: 3 });

        // Delete the default text in todolist
        await clearText(page.keyboard, 29);

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
        await clearText(page.keyboard, 45);

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

    // Test 6
    it('TODO list and branch link is loaded correctly after revisiting site; save is maintained', async () => {
        await page.reload();

        // Verify the changes after reloading the page
        let savedTodoList = await page.$eval('.project-todo-list', el => el.textContent.trim());
        expect(savedTodoList).toBe('New TODO item');

        let savedBranchLink = await page.$eval('.project-branch-link', el => el.textContent.trim());
        expect(savedBranchLink).toBe('https://newbranchlink.com');

        // Navigate back to the home page and come back to project page
        await page.click('nav .nav-button:first-of-type');
        await page.waitForSelector('.projects li'); // Wait for the projects to appear
        await page.click('.projects li:nth-child(1)');
        await page.waitForSelector('.project-todo-list'); // Wait for the project details to appear

        // Verify the changes
        savedTodoList = await page.$eval('.project-todo-list', el => el.textContent.trim());
        expect(savedTodoList).toBe('New TODO item');

        savedBranchLink = await page.$eval('.project-branch-link', el => el.textContent.trim());
        expect(savedBranchLink).toBe('https://newbranchlink.com');
    });

    // Test 7
    it('Add log and check in day page', async () => {
        // Click all logs button in project home page
        await page.waitForSelector('.all-logs-btn'); 
        await page.click('.all-logs-btn');

        // Click current day in calendar in month page
        await page.waitForSelector('.month-calendar-title');
        const currentDay = new Date().getDate();
        await page.waitForSelector('.dates li')
        await page.evaluate((currentDay) => {
            const dates = document.querySelectorAll('.dates li');
            dates.forEach((date) => {
                if (date.textContent.trim() == currentDay) {
                    date.click();
                }
            });
        }, currentDay);

        // Creating first log
        // Click add log button (which is + button) in day page
        await page.waitForSelector('.day-header-div');
        await page.click('.add-log');

        // Type title, time, contributor, description, and code snippet in add log page
        await page.waitForSelector('.log-title');
        await page.type('#log-title', 'Log Title1');
        await page.evaluate(() => {
            document.querySelector('#log-time').value = '12:00';
        });
        await page.type('#log-contributor', 'Log Contributor1');
        await page.type('#log-description', 'Log Description1');
        await page.evaluate(() => {
            window.editor.setValue('console.log("Hello World");');
        });
        await page.click('.submit-btn');

        // In day page, load each data of first log that we created
        /* After creating log, the html would look like:
           .calendar-body
             - #day-calendar-time
                - .time div
                - .time div
                ...
             - #day-calendar-title
                - .title div
                - .title div
                ...
             - #day-calendar-description
                - .description div
                - .description div
                ...
             - #day-calendar-progress
             - #day-calendar-snippet 
                ...
                - .CodeMirror-line
                   span (that contains code snippet content)
        */
        await page.waitForSelector('.day-calendar-div');
        const logTitle = await page.$eval('.calendar-body #day-calendar-title .title', el => el.textContent.trim());
        const logTime = await page.$eval('.calendar-body #day-calendar-time .time', el => el.textContent.trim());
        const logDescription = await page.$eval('.calendar-body #day-calendar-description .description', el => el.textContent.trim());
        const logCodeSnippet = await page.$eval(
            '.CodeMirror-line span', el => el.textContent.trim());

        expect(logTitle).toBe('Log Title1');
        expect(logTime).toBe('12:00');
        expect(logDescription).toBe('Log Description1');
        expect(logCodeSnippet).toBe('console.log("Hello World");');
        
        // Creating second log
        // click add log button (which is + button) in day page
        await page.waitForSelector('.day-header-div');
        await page.click('.add-log');

        // Type title, time, contributor, description, and code snippet in add log page
        await page.waitForSelector('.log-title');
        await page.type('#log-title', 'Log Title2');
        await page.evaluate(() => {
            document.querySelector('#log-time').value = '12:30';
        });
        await page.type('#log-contributor', 'Log Contributor2');
        await page.type('#log-description', 'Log Description2');
        await page.evaluate(() => {
            window.editor.setValue('console.log("This is second one");');
        });
        await page.click('.submit-btn');

        // In day page, load each data of second log that we created
        await page.waitForSelector('.day-calendar-div');
        const logTitle2 = await page.$eval('.calendar-body #day-calendar-title .title:nth-of-type(2)', el => el.textContent.trim());
        const logTime2 = await page.$eval('.calendar-body #day-calendar-time .time:nth-of-type(2)', el => el.textContent.trim());
        const logDescription2 = await page.$eval('.calendar-body #day-calendar-description .description:nth-of-type(2)', el => el.textContent.trim());
        const logCodeSnippet2 = await page.$eval(
            '.code-snippet:nth-of-type(2) .CodeMirror-line span ', el => el.textContent.trim());

        expect(logTitle2).toBe('Log Title2');
        expect(logTime2).toBe('12:30');
        expect(logDescription2).toBe('Log Description2');
        expect(logCodeSnippet2).toBe('console.log("This is second one");');
    });

    // Test 8
    it('Check week page contains logs updated', async () => {
        // Click week button
        await page.waitForSelector('.day-header-div'); 
        await page.click('#week-tab');

        // Load the number of logs in current day 
        await page.waitForSelector('.week-calendar-div');
        const todayDate = getTodayDate();
        const numberOfLogs = await page.$$eval(`.calendar-body .day-column[data-date='${todayDate}'] .log-title`, items => items.length);
        expect(numberOfLogs).toBe(2);

        // Load the title of first log appeared in current day in week calendar
        const firstLogTitle = await page.$eval(`.calendar-body .day-column[data-date='${todayDate}'] div:nth-of-type(3)`, el => el.textContent.trim());
        expect(firstLogTitle).toBe('Log Title1');

        // Load the title of second log appeared in current day in week calendar
        const secondLogTitle = await page.$eval(`.calendar-body .day-column[data-date='${todayDate}'] div:nth-of-type(4)`, el => el.textContent.trim());
        expect(secondLogTitle).toBe('Log Title2');
    });  
    
    // Test 9
    it('Check if the updated logs are still maintained after revisiting day page', async () => {
        // Click current day in week calendar
        await page.waitForSelector('.week-calendar-div');
        const todayDate = getTodayDate();
        await page.click(`.calendar-body .day-column[data-date='${todayDate}']`);

        // In day page, load each data of first log that we created
        await page.waitForSelector('.day-calendar-div');
        const logTitle = await page.$eval('.calendar-body #day-calendar-title .title', el => el.textContent.trim());
        const logTime = await page.$eval('.calendar-body #day-calendar-time .time', el => el.textContent.trim());
        const logDescription = await page.$eval('.calendar-body #day-calendar-description .description', el => el.textContent.trim());
        const logCodeSnippet = await page.$eval(
            '.CodeMirror-line span', el => el.textContent.trim());

        expect(logTitle).toBe('Log Title1');
        expect(logTime).toBe('12:00');
        expect(logDescription).toBe('Log Description1');
        expect(logCodeSnippet).toBe('console.log("Hello World");');

        // In day page, load each data of second log that we created
        await page.waitForSelector('.day-calendar-div');
        const logTitle2 = await page.$eval('.calendar-body #day-calendar-title .title:nth-of-type(2)', el => el.textContent.trim());
        const logTime2 = await page.$eval('.calendar-body #day-calendar-time .time:nth-of-type(2)', el => el.textContent.trim());
        const logDescription2 = await page.$eval('.calendar-body #day-calendar-description .description:nth-of-type(2)', el => el.textContent.trim());
        const logCodeSnippet2 = await page.$eval(
            '.code-snippet:nth-of-type(2) .CodeMirror-line span ', el => el.textContent.trim());

        expect(logTitle2).toBe('Log Title2');
        expect(logTime2).toBe('12:30');
        expect(logDescription2).toBe('Log Description2');
        expect(logCodeSnippet2).toBe('console.log("This is second one");');
    });

    // Test 10
    it('Add log to another project and check in day page', async () => {
        // Navigate back to the home page (first nav button is home page button)
        await page.waitForSelector('.header-nav');
        await page.click('nav .nav-button:first-of-type');

        // Click the second project 
        await page.waitForSelector('.projects li'); 
        await page.click('.projects li:nth-child(2)');

        // Click all logs button in project home page
        await page.waitForSelector('.all-logs-btn'); 
        await page.click('.all-logs-btn');
        
        // Click current day in calendar in month page
        await page.waitForSelector('.month-calendar-title');
        const currentDay = new Date().getDate();
        await page.waitForSelector('.dates li')
        await page.evaluate((currentDay) => {
            const dates = document.querySelectorAll('.dates li');
            dates.forEach((date) => {
                if (date.textContent.trim() == currentDay) {
                    date.click();
                }
            });
        }, currentDay);

        // Creating first log
        // Click add log button (which is + button) in day page
        await page.waitForSelector('.day-header-div');
        await page.click('.add-log');

        // Type title, time, contributor, description, and code snippet in add log page
        await page.waitForSelector('.log-title');
        await page.type('#log-title', 'Log Title1 - for project 2');
        await page.evaluate(() => {
            document.querySelector('#log-time').value = '12:00';
        });
        await page.type('#log-contributor', 'Log Contributor1 - for project 2');
        await page.type('#log-description', 'Log Description1 - for project 2');
        await page.evaluate(() => {
            window.editor.setValue('console.log("Hello World - for project 2");');
        });
        await page.click('.submit-btn');

        // In day page, load each data of first log that we created
        await page.waitForSelector('.day-calendar-div');
        const logTitle = await page.$eval('.calendar-body #day-calendar-title .title', el => el.textContent.trim());
        const logTime = await page.$eval('.calendar-body #day-calendar-time .time', el => el.textContent.trim());
        const logDescription = await page.$eval('.calendar-body #day-calendar-description .description', el => el.textContent.trim());
        const logCodeSnippet = await page.$eval(
            '.CodeMirror-line span', el => el.textContent.trim());

        expect(logTitle).toBe('Log Title1 - for project 2');
        expect(logTime).toBe('12:00');
        expect(logDescription).toBe('Log Description1 - for project 2');
        expect(logCodeSnippet).toBe('console.log("Hello World - for project 2");');
        
        // Creating second log
        // click add log button (which is + button) in day page
        await page.waitForSelector('.day-header-div');
        await page.click('.add-log');

        // Type title, time, contributor, description, and code snippet in add log page
        await page.waitForSelector('.log-title');
        await page.type('#log-title', 'Log Title2 - for project 2');
        await page.evaluate(() => {
            document.querySelector('#log-time').value = '12:30';
        });
        await page.type('#log-contributor', 'Log Contributor2 - for project 2');
        await page.type('#log-description', 'Log Description2 - for project 2');
        await page.evaluate(() => {
            window.editor.setValue('console.log("This is second one - for project 2");');
        });
        await page.click('.submit-btn');

        // In day page, load each data of second log that we created
        await page.waitForSelector('.day-calendar-div');
        const logTitle2 = await page.$eval('.calendar-body #day-calendar-title .title:nth-of-type(2)', el => el.textContent.trim());
        const logTime2 = await page.$eval('.calendar-body #day-calendar-time .time:nth-of-type(2)', el => el.textContent.trim());
        const logDescription2 = await page.$eval('.calendar-body #day-calendar-description .description:nth-of-type(2)', el => el.textContent.trim());
        const logCodeSnippet2 = await page.$eval(
            '.code-snippet:nth-of-type(2) .CodeMirror-line span ', el => el.textContent.trim());

        expect(logTitle2).toBe('Log Title2 - for project 2');
        expect(logTime2).toBe('12:30');
        expect(logDescription2).toBe('Log Description2 - for project 2');
        expect(logCodeSnippet2).toBe('console.log("This is second one - for project 2");');
    });

    // Test 11
    it('Check week page contains logs updated for project 2', async () => {
        // Click week button
        await page.waitForSelector('.day-header-div'); 
        await page.click('#week-tab');

        // Load the number of logs in current day 
        await page.waitForSelector('.week-calendar-div');
        const todayDate = getTodayDate();
        const numberOfLogs = await page.$$eval(`.calendar-body .day-column[data-date='${todayDate}'] .log-title`, items => items.length);
        expect(numberOfLogs).toBe(2);

        // Load the title of first log appeared in current day in week calendar
        const firstLogTitle = await page.$eval(`.calendar-body .day-column[data-date='${todayDate}'] div:nth-of-type(3)`, el => el.textContent.trim());
        expect(firstLogTitle).toBe('Log Title1 - for project 2');

        // Load the title of second log appeared in current day in week calendar
        const secondLogTitle = await page.$eval(`.calendar-body .day-column[data-date='${todayDate}'] div:nth-of-type(4)`, el => el.textContent.trim());
        expect(secondLogTitle).toBe('Log Title2 - for project 2');
    });  

    // Test 12
    it('Check feedback function in feedback page', async () => {
        // Click feedback button
        await page.waitForSelector('.feedback-section'); 
        await page.click('.feedback-section a');

        // Fill out the feedback form
        await page.waitForSelector('.sentiment-widget form');
        await page.type('#name', 'Jaewon Han');
        await page.type('#email', 'example@gmail.com');
        await page.type('#feedback', 'This website is so cool!');
        await page.waitForSelector('.radio-container');
        await page.evaluate(() => {
            let radio = document.querySelector('#satisfaction1');
            radio.click();
        });

        // allow alert/dialog to be accepted if they pop up
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        // Click the submit button
        await page.click('.submit-btn');
        await delay(500); // Add delay for stability


        // Go back to main home page in success page 
        await page.waitForSelector('main');
        await page.click('main a');

        // Check local storage to see feedback submission 
        const submissionData = await page.evaluate(() => JSON.parse(localStorage.getItem('feedback_submissions')));
        const submissionCount = submissionData.length;
        expect(submissionCount).toBe(1);
    }); 
});