// Dummy project data
const dummyProjectData = {
    project_data: {
        project_1: {
            projectName: "Project 1",
            projectTag: "Tag 1",
            projectContributors: "Contributor 1, Contributor 2",
            projectDescription: "Description for Project 1",
            active: true,
            logs: {},
            BranchLink: "https://example.com/project1",
            TodoList: {}
        },
        project_2: {
            projectName: "Project 2",
            projectTag: "Tag 2",
            projectContributors: "Contributor 3, Contributor 4",
            projectDescription: "Description for Project 2",
            active: true,
            logs: {},
            BranchLink: "https://example.com/project2",
            TodoList: {}
        }
    }
};

// Initialize the projects data in localStorage
const projectDataString = localStorage.getItem('projectData');
if (!projectDataString) {
    localStorage.setItem('projectData', JSON.stringify(dummyProjectData));
} else {
    try {
        const projectData = JSON.parse(projectDataString);
        if (projectData && projectData.project_data) {
            // Use the validated projectData
        } else {
            // Handle invalid projectData
            console.error('Invalid project data in localStorage');
        }
    } catch (error) {
        console.error('Error parsing project data from localStorage:', error);
    }
}

// Function to render the projects list
function renderProjects() {
    const projectsList = document.querySelector('.projects');
    projectsList.innerHTML = '';

    const projectData = JSON.parse(localStorage.getItem('projectData')).project_data;
    for (const projectId in projectData) {
        if (Object.prototype.hasOwnProperty.call(projectData, projectId)) {
            let project = projectData[parseInt(projectId)];
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
    projectElement.appendChild(projectTitle);

    const projectTag = document.createElement('p');
    projectTag.textContent = `Tag: ${project.projectTag}`;
    projectElement.appendChild(projectTag);

    const projectContributors = document.createElement('p');
    projectContributors.textContent = `Contributors: ${project.projectContributors}`;
    projectElement.appendChild(projectContributors);

    const projectDescription = document.createElement('p');
    projectDescription.textContent = `Description: ${project.projectDescription}`;
    projectElement.appendChild(projectDescription);

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
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteProject(projectId);
    });
    projectActions.appendChild(deleteButton);

    projectElement.appendChild(projectActions);
    projectElement.addEventListener('click', () => {
        const projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('projectData'))));
        projectDataCopy.current_project = projectId;
        projectDataCopy.current_date = new Date().toLocaleDateString();
        localStorage.setItem('projectData', JSON.stringify(projectDataCopy));
        window.location.href = escape("../projectHomePage/project_home_page.html");
    });

    return projectElement;
}

// Function to archive a project
function archiveProject(projectId) {
    let projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('projectData'))));
    projectDataCopy.project_data[parseInt(projectId)].active = false;
    localStorage.setItem('projectData', JSON.stringify(projectDataCopy));
    renderProjects();
}

// Function to delete a project
function deleteProject(projectId) {
    let projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('projectData'))));
    delete projectDataCopy.project_data[parseInt(projectId)];
    localStorage.setItem('projectData', JSON.stringify(projectDataCopy));
    renderProjects();
}

// Render the projects on page load
renderProjects();