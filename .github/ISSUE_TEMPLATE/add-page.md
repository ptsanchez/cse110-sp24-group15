---
name: Add Page
about: Add a page for the project
title: Add Page
labels: New Page
assignees: ''

---

## Add _____ Page

#### Description: 
- Create and design the HTML, CSS and JS for ________
- Use [miro-board](https://github.com/cse110-sp24-group15/cse110-sp24-group15/blob/main/specs/pitch/miro_design_updated.pdf) for the design
- NOTE: all the project data will be stored in the localStorage as a JSON string with the following format:

```
{ 
current_project: project_n, 
current_date: MM/DD/YYYY
project_data: {
     project_1: {
          projectName: Name, 
          projectTag: Tag, 
          projectContributors: contributors, 
          projectDescription: Description, 
          active: true/false,
          logs: {log_1: {data: BLANK, time: HH:MM, day: DD, Month: MM, Year: YYYY, title: TEXT, contributors: Text}, ...}, 
          BranchLink: link,
          TodoList: {task1: description}
     project_2: ... }
}
```
#### First step:
- [ ] Create a directory in 'projects' called ______ 

#### TODOs HTML
- [ ] from 'projects/template', copy "template.html" to 'projects/'
- [ ] Rename this file as '.html'


#### TODOs CSS
- [ ] from 'projects/template', copy "template.css" to 'projects/'
- [ ] Rename this file as '.css'


#### TODOs Javascript
- [ ] in 'projects/', create '.js'
