/**
 * Create a template JSON string with new project data
 * @param {object} formObj - Form data object with data of new project
 * @returns {string} A JSON string ready to be stored in local storage
 */
function initializeProjectData(formObj) {
    let projectsObj = {
        current_project: '',
        current_date: (new Date()).toLocaleDateString(),
        project_data: {
            project_1: {
                projectName: formObj['project-name'], 
                projectTag: formObj['project-tag'], 
                projectContributors: formObj['project-contributor'], 
                projectDescription: formObj['project-description'], 
                active: true,
                logs: {},
                BranchLink: '', 
                TodoList: {}
            }
        }
    };
    return JSON.stringify(projectsObj);
}

/**
 * Update JSON string to include new project data
 * @param {object} formObj - Form data object with data of new project
 * @param {string} localStr - The JSON string obtained from local storage
 * @returns {string} A JSON string ready to be stored in local storage
 */
function updateProjectData(formObj, localStr) {
    let projectsObj = JSON.parse(localStr);
    const newIndex = Object.keys(projectsObj.project_data).length;
    const newName = `project_${newIndex + 1}`;
    projectsObj.project_data[String(newName)] = {
        projectName: formObj['project-name'], 
        projectTag: formObj['project-tag'], 
        projectContributors: formObj['project-contributor'], 
        projectDescription: formObj['project-description'], 
        active: true,
        logs: {}, 
        BranchLink: '',
        TodoList: {} 
    }
    return JSON.stringify(projectsObj);
}

/**
 * Check if local storage is empty and decide whether to initialize or update
 * local storage
 * @param {object} formObj - Form data object with data of new project
 * @param {function} getItem - Function to get item from storage
 * @param {function} setItem - Function to set item in storage
 */
function submissionLogic(formObj, getItem, setItem) {
    let localStr = getItem('project_data');
    if (localStr == null) {
        localStr = initializeProjectData(formObj);
    } else {
        localStr = updateProjectData(formObj, localStr);
    }
    setItem('project_data', localStr);
}

/**
 * Handles form submmision
 * @param {HTMLElement} form - Form element
 */
function handleSubmission(form) {
    const formData = new FormData(form);
    const formObj = {};
    for (const pair of formData.entries()) {
        formObj[pair[0]] = pair[1];
    }
    submissionLogic(formObj, localStorage.getItem.bind(localStorage), localStorage.setItem.bind(localStorage));
}

if (typeof document !== 'undefined') {
    const form = document.querySelector('form');
    form.addEventListener('submit', () => {
        handleSubmission(form);
    });
}

if (typeof module === 'object' && module.exports) {
    module.exports = { initializeProjectData, updateProjectData, submissionLogic };
}
