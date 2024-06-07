const puppeteer = require('puppeteer');

describe('Basic user flow', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://127.0.0.1:5500/project/addProjectPage/add_project_page.html');
    });

    afterAll(async () => {
        await browser.close();
    });
  
    it('Test', async () => {
        const button = await page.$('button');
        await button.click();
        expect(1 + 1).toBe(2);
    });
});