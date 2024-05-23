document.addEventListener('DOMContentLoaded', function() {
    // Sample data generation
    function generateSampleProjects() {
        // Array to hold sample projects
        let sampleProjects = [];

        // Generate 10 sample projects
        for (let i = 1; i <= 10; i++) {
            let project = {
                projectName: `Project ${i}`,
                projectTag: `Tag ${i}`,
                projectContributors: `Contributors ${i}`,
                projectDescription: `Description ${i}`,
                active: i <= 7 ? false : true, // Set active property based on index
                logs: {}, // Initialize empty logs object
                BranchLink: `Link ${i}`,
                TodoList: {} // Initialize empty TodoList object
            };
            sampleProjects.push(project);
        }

        // Create an object to store all projects
        let projectData = {
            current_project: "",
            current_date: "",
            project_data: {}
        };

        // Assign sample projects to the project_data object
        sampleProjects.forEach((project, index) => {
            projectData.project_data[`project_${index + 1}`] = project;
        });

        // Convert the project data to a JSON string
        let projectDataJSON = JSON.stringify(projectData);

        // Store the project data in localStorage
        localStorage.setItem('projectData', projectDataJSON);
    }

    // Call the function to generate sample projects
    generateSampleProjects();

    // Pulling out all active: false projects
    let localStorageData = localStorage.getItem('projectData');

    // Checking if localStorage has any projectData
    if (localStorageData) {
        // Parse the JSON string to an object
        let projectData = JSON.parse(localStorageData);

        // Extract active: false projects
        let inactiveProjects = Object.entries(projectData.project_data)
            .filter(([_, project]) => !project.active)
            .reduce((acc, [key, project]) => {
                acc[key] = project;
                return acc;
            }, {});

        // Convert inactive projects to a JSON string
        let inactiveProjectsJSON = JSON.stringify(inactiveProjects);

        // Place inactive projects in sessionStorage
        sessionStorage.setItem('inactiveProjects', inactiveProjectsJSON);
    } else {
        console.log('No project data found in localStorage.');
    }

    // Retrieve project data from session storage
    let sessionStorageData = sessionStorage.getItem('inactiveProjects');
    let projectData = JSON.parse(sessionStorageData);

    // Function to populate project list on the current page
    function populateProjectList(pageNumber) {
        let projectList = document.querySelector('.ProjectList');
        projectList.innerHTML = ''; // Clear existing projects

        // Calculate start and end indices for projects on the current page
        let startIdx = (pageNumber - 1) * 5;
        let endIdx = Math.min(startIdx + 5, Object.keys(projectData).length);

        // Populate project list with projects from startIdx to endIdx
        for (let i = startIdx; i < endIdx; i++) {
            let projectKey = `project_${i + 1}`;
            let project = projectData[projectKey];
            addProjectToList(project, projectKey);
        }
    }

    // Function to add a single project to the project list
    function addProjectToList(project, projectKey) {
        // Create list item element
        let projectListItem = document.createElement('li');
        projectListItem.classList.add('Project');

        // Set project name
        projectListItem.textContent = project.projectName;

        // Create delete button
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('deleteButton');

        // Create span element for trash can icon
        let trashIcon = document.createElement('span');
        trashIcon.innerHTML = '&#128502;';

        // Append trash icon to delete button
        deleteButton.appendChild(trashIcon);

        // Append delete button to list item
        projectListItem.appendChild(deleteButton);

        // Add click event listener to project item
        projectListItem.addEventListener('click', function() {
            handleProjectClick(projectKey);
        });

        // Append list item to project list
        let projectList = document.querySelector('.ProjectList');
        projectList.appendChild(projectListItem);
    }

    // Function to handle clicking on a project
    function handleProjectClick(projectKey) {
        // Retrieve project data from localStorage
        let localStorageData = localStorage.getItem('projectData');
        if (localStorageData) {
            let projectData = JSON.parse(localStorageData);

            // Set the current project in localStorage
            projectData.current_project = projectKey;
            localStorage.setItem('projectData', JSON.stringify(projectData));

            // Redirect to the project homepage
            window.location.href = '../projects/projectHomePage/project_home_page.html';
        } 
        else {
            console.log('No project data found in localStorage.');
        }
    }

    // Function to handle moving to the previous page
    function moveToPreviousPage() {
        // Get the current page number from session storage
        let currentPage = parseInt(sessionStorage.getItem('currentPage')) || 1;

        // Move to previous page if not on the first page
        if (currentPage > 1) {
            currentPage--;
            sessionStorage.setItem('currentPage', currentPage);
            populateProjectList(currentPage);
        }
    }

    // Function to handle moving to the next page
    function moveToNextPage() {
        // Get the current page number from session storage
        let currentPage = parseInt(sessionStorage.getItem('currentPage')) || 1;

        // Move to next page if not on the last page
        if (currentPage < Math.ceil(Object.keys(projectData).length / 5)) {
            currentPage++;
            sessionStorage.setItem('currentPage', currentPage);
            populateProjectList(currentPage);
        }
    }

    // Function to handle search
    function handleSearch() {
        let searchQuery = document.querySelector('.Search').value.trim().toLowerCase();

        // Iterate over project data to find matching project
        for (let projectKey in projectData) {
            let project = projectData[projectKey];
            if (project.projectName.toLowerCase() === searchQuery) {
                // Calculate the page number where the project is located
                let projectIndex = parseInt(projectKey.split('_')[1]);
                let pageNumber = Math.ceil(projectIndex / 5);

                // Update the page to display the found project
                sessionStorage.setItem('currentPage', pageNumber);
                populateProjectList(pageNumber);
                return; // Exit the function after finding the project
            }
        }

        // If project is not found, provide feedback to the user
        alert('Project not found.');
    }

    // Populate the project list on initial page load
    let currentPage = 1;
    sessionStorage.setItem('currentPage', currentPage);
    populateProjectList(currentPage);

    // Add event listeners to page navigation buttons
    document.querySelector('.pageBackBtn').addEventListener('click', moveToPreviousPage);
    document.querySelector('.pageNextBtn').addEventListener('click', moveToNextPage);

    // Search functionality
    document.querySelector('.Search').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            let query = event.target.value.toLowerCase();
            let projectKeys = Object.keys(projectData);
            let foundProjectKey = projectKeys.find(key => projectData[key].projectName.toLowerCase() === query);
            if (foundProjectKey) {
                let foundIndex = projectKeys.indexOf(foundProjectKey);
                let pageNumber = Math.floor(foundIndex / 5) + 1;
                sessionStorage.setItem('currentPage', pageNumber);
                populateProjectList(pageNumber);
            } else {
                console.log('Project not found.');
            }
        }
    });
});