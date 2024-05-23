const form = document.querySelector('form');
form.addEventListener('submit', () => {
    const formData = new FormData(form);
    const formObj = {};
    for (const pair of formData.entries()) {
        formObj[pair[0]] = pair[1];
    }
    let localStr = localStorage.getItem('projects'); // TODO: Change key accordingly
    var projectsObj = {};
    // Create JSON string if it does not exist
    if (localStr == null) {
        projectsObj = {
            current_project: '', // TODO 
            current_date: (new Date()).toLocaleDateString(),
            project_data: {
                project_1: {
                    projectName: formObj['projectName'], 
                    projectTag: formObj['projectTag'], 
                    projectContributors: formObj['projectContributor'], 
                    projectDescription: formObj['projectDescription'], 
                    active: true,
                    logs: {}, // TODO
                    BranchLink: '', // TODO
                    TodoList: {} // TODO
                }
            }
        };
    }
    // Update project_data otherwise
    else {
        projectsObj = JSON.parse(localStr);
        const newIndex = Object.keys(projectsObj.project_data).length;
        const newName = `project_${newIndex + 1}`;
        projectsObj.project_data[newName] = {
            projectName: formObj['projectName'], 
            projectTag: formObj['projectTag'], 
            projectContributors: formObj['projectContributor'], 
            projectDescription: formObj['projectDescription'], 
            active: true,
            logs: {}, // TODO
            BranchLink: '', // TODO
            TodoList: {} // TODO
        }
    }
    localStr = JSON.stringify(projectsObj);
    localStorage.setItem('projects', localStr);
});

//localStorage.clear();