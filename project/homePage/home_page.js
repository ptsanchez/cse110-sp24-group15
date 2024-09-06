// Function to render the projects list
function renderProjects() {
    const projectsList = document.querySelector('.projects');
    projectsList.innerHTML = '';

    const projectData = JSON.parse(localStorage.getItem('project_data'));
    let projects = projectData['project_data'];
    console.log(projects);
    for (const projectId in projects) {
        if (projects[String(projectId)] !== null) {
            let project = projects[String(projectId)];
            if (project.active) {
                const projectElement = createProjectElement(project, projectId);
                projectsList.appendChild(projectElement);
            }
        }
    }
}

// Function to create a project element
function createProjectElement(project, projectId) {
    const projectElement = document.createElement('li');

    const projectTitle = document.createElement('h3');
    projectTitle.textContent = project.projectName;
    projectTitle.classList.add('project-title');
    projectElement.appendChild(projectTitle);

    const projectDetails = document.createElement('div');
    projectDetails.classList.add('project-details');

    const projectTagContributors = document.createElement('div');
    projectTagContributors.classList.add('project-tag-contributors');

    const projectTag = document.createElement('p');
    const tagLabel = document.createElement('span');
    tagLabel.classList.add('label');
    tagLabel.textContent = 'Tag:';
    projectTag.appendChild(tagLabel);
    projectTag.appendChild(document.createTextNode(` ${project.projectTag}`));

    const separator = document.createTextNode(' | ');

    const projectContributors = document.createElement('p');
    const contributorsLabel = document.createElement('span');
    contributorsLabel.classList.add('label');
    contributorsLabel.textContent = 'Contributors:';
    projectContributors.appendChild(contributorsLabel);
    projectContributors.appendChild(document.createTextNode(` ${project.projectContributors}`));

    projectTagContributors.appendChild(projectTag);
    projectTagContributors.appendChild(separator);
    projectTagContributors.appendChild(projectContributors);

    projectDetails.appendChild(projectTagContributors);

    const projectDescription = document.createElement('p');
    const descriptionLabel = document.createElement('span');
    descriptionLabel.classList.add('label');
    descriptionLabel.textContent = 'Description:';
    projectDescription.appendChild(descriptionLabel);
    projectDescription.appendChild(document.createTextNode(` ${project.projectDescription}`));
    projectDetails.appendChild(projectDescription);

    projectElement.appendChild(projectDetails);

    const projectActions = document.createElement('div');
    projectActions.classList.add('project-actions');

    const archiveButton = document.createElement('button');
    archiveButton.textContent = 'Archive';
    archiveButton.classList.add('archive-btn');
    archiveButton.addEventListener('click', (event) => {
        event.stopPropagation();
        archiveProject(projectId);
    });
    projectActions.appendChild(archiveButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');

    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash');
    deleteButton.appendChild(icon);

    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteProject(projectId);
    });

    projectActions.appendChild(deleteButton);
    projectElement.appendChild(projectActions);

    projectElement.addEventListener('click', () => {
        const projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('project_data'))));
        projectDataCopy.current_project = projectId;
        projectDataCopy.current_date = new Date().toLocaleDateString();
        localStorage.setItem('project_data', JSON.stringify(projectDataCopy));
        window.location.href = escape("../projectHomePage/project_home_page.html");
    });

    return projectElement;
}

// Function to archive a project
function archiveProject(projectId) {
    let projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('project_data'))));
    projectDataCopy['project_data'][String(projectId)]['active'] = false;
    localStorage.setItem('project_data', JSON.stringify(projectDataCopy));
    renderProjects();
}

// Function to delete a project
function deleteProject(projectId) {
    let projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('project_data'))));
    let projectData = projectDataCopy.project_data;
    projectId = String(projectId);

    // Create a new object excluding the key to delete
    let newProjectData = Object.keys(projectData).reduce((newData, key) => {
        if (key !== projectId) {
            newData[String(key)] = projectData[String(key)];
        }
        return newData;
    }, {});

    projectDataCopy.project_data = newProjectData;
    localStorage.setItem('project_data', JSON.stringify(projectDataCopy));
    renderProjects();
}


// Render the projects on page load
renderProjects();

if (typeof module === 'object' && module.exports) {
    module.exports = {renderProjects, archiveProject, deleteProject};
}