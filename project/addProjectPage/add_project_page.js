/**
 * Create a template JSON string with new project data
 * @param {object} formObj - Data of new project
 * @returns {string} A JSON string ready to be stored in local storage
 */
function createProjectData(formObj) {
    let projectsObj = {
        current_project: '', // TODO 
        current_date: (new Date()).toLocaleDateString(),
        project_data: {
            project_1: {
                projectName: formObj['project-name'], 
                projectTag: formObj['project-tag'], 
                projectContributors: formObj['project-contributor'], 
                projectDescription: formObj['project-description'], 
                active: true,
                logs: {}, // TODO
                BranchLink: '', // TODO
                TodoList: {} // TODO
            }
        }
    };
    return JSON.stringify(projectsObj);
}

/**
 * Update JSON string to include new project data
 * @param {object} formObj - Data of new project
 * @param {string} localStr - The JSON string obtained from local storage
 * @returns {string} A JSON string ready to be stored in local storage
 */
function updateProjectData(formObj, localStr) {
    let projectsObj = JSON.parse(localStr);
    const newIndex = Object.keys(projectsObj.project_data).length;
    const newName = `project_${newIndex + 1}`;
    projectsObj.project_data[newName] = {
        projectName: formObj['project-name'], 
        projectTag: formObj['project-tag'], 
        projectContributors: formObj['project-contributor'], 
        projectDescription: formObj['project-description'], 
        active: true,
        logs: {}, // TODO
        BranchLink: '', // TODO
        TodoList: {} // TODO
    }
    return JSON.stringify(projectsObj);
}

/**
 * Update local storage with submitted form data
 * @param {HTMLElement} form - Form element
 */
function handleSubmission(form) {
    const formData = new FormData(form);
    const formObj = {};
    for (const pair of formData.entries()) {
        formObj[pair[0]] = pair[1];
    }
    let localStr = localStorage.getItem('projects'); // TODO: Change key accordingly
    if (localStr == null) {
        localStr = createProjectData(formObj);
    } else {
        localStr = updateProjectData(formObj, localStr);
    }
    localStorage.setItem('projects', localStr);
}

const form = document.querySelector('form');
form.addEventListener('submit', () => {
    handleSubmission(form);
});