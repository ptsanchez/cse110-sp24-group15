document.addEventListener('DOMContentLoaded', function () {
    // Number of projects to display per page
    const projectsPerPage = 5;

    // Current page number, initially set to 1
    let currentPage = 1;

    // Array to store the projects
    let projects = [];

    // Store the initial current page in sessionStorage
    sessionStorage.setItem('current_page', currentPage);

    // Function to load projects from localStorage, filter them, and store in sessionStorage
    function loadProjects() {
        // Retrieve the project_data from localStorage
        let projData = localStorage.getItem("project_data");

        // Check if projData is null or empty
        if (projData) {
            // Parse the project data
            projData = JSON.parse(projData);
            
            // Filter projects to include only non-active ones
            projects = Object.entries(projData.project_data).filter(([key, project]) => key && !project.active);
            
            // Store the filtered projects in sessionStorage
            sessionStorage.setItem("archived_projects", JSON.stringify(projects));
        } else {
            // If there is no project_data in localStorage, initialize projects to an empty array
            projects = [];
            console.log("No projects in local storage");
        }
        
        // Display the projects
        displayProjects();
    }

    // Function to display projects on the page
    function displayProjects(filteredProjects = projects) {
        // Get the project list container
        const projectList = document.querySelector('.project-list');

        // Clear the existing project list
        projectList.innerHTML = '';

        // Calculate the start and end indices for the current page
        const start = (currentPage - 1) * projectsPerPage;
        const end = start + projectsPerPage;

        // Get the projects for the current page
        const paginatedProjects = filteredProjects.slice(start, end);

        // Iterate over each project and create a list item for it
        paginatedProjects.forEach(([key, project]) => {
            // Create list item
            let listItem = document.createElement('li');
            listItem.classList.add('project');

            // Create span element for project name
            let projectNameSpan = document.createElement('span');
            projectNameSpan.textContent = project.projectName;
            listItem.appendChild(projectNameSpan);

            // Create delete button
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');

            // Create icon element
            let icon = document.createElement('i');
            icon.classList.add('fas', 'fa-trash');

            deleteButton.appendChild(icon);

            // Add event listener for delete button
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering the project click event
                deleteProject(key);
            });

            // Append delete button to list item
            listItem.appendChild(deleteButton);

            // Add event listener for project item click
            listItem.addEventListener('click', () => {
                let projData = JSON.parse(localStorage.getItem("project_data"));
                projData.current_project = key;
                localStorage.setItem('project_data', JSON.stringify(projData));
                window.location.href = escape("../projectHomePage/project_home_page.html");
            });

            // Append the list item to the project list
            projectList.appendChild(listItem);
        });
    }

    // Function to delete a project
    function deleteProject(projectKey) {
        // Remove the project from the projects array
        projects = projects.filter(([key, project]) => key !== projectKey && project);
        
        // Update sessionStorage with the modified projects array
        sessionStorage.setItem('archived_projects', JSON.stringify(projects));

        // Retrieve the project data from localStorage
        let projData = JSON.parse(localStorage.getItem("project_data"));

        // Create a new object without the projectKey property
        const updatedProjectData = Object.fromEntries(
            Object.entries(projData.project_data).filter(([key, value]) => key !== projectKey && value)
        );

        // Update localStorage with the modified project data
        localStorage.setItem('project_data', JSON.stringify({ ...projData, project_data: updatedProjectData }));

        // Redisplay the updated list of projects
        displayProjects();
    }

    // Function to handle page changes (next and previous)
    function handlePageChange(currentPage, direction) {
        // Calculate the total number of pages
        const totalPages = Math.ceil(projects.length / projectsPerPage);

        // Update the current page number within the valid range
        const updatedCurrentPage = Math.max(1, Math.min(currentPage + direction, totalPages));

        // Store the updated current page in sessionStorage
        sessionStorage.setItem('current_page', updatedCurrentPage);

        // Redisplay the projects for the new page
        displayProjects();
        return updatedCurrentPage;
    }

    // Function to handle search functionality
    function handleSearch(event) {
        const searchQuery = event.target.value.toLowerCase();
        const filteredProjects = projects.filter(([, project]) =>
            project.projectName.toLowerCase().includes(searchQuery)
        );

        // Redisplay the filtered projects
        displayProjects(filteredProjects);
    }

    // Event listener for the 'Page Back' button
    document.querySelector('.page-back-btn').addEventListener('click', () => {
        currentPage = handlePageChange(currentPage, -1);
    });

    // Event listener for the 'Next Page' button
    document.querySelector('.page-next-btn').addEventListener('click', () => {
        currentPage = handlePageChange(currentPage, 1);
    });

    // Event listener for the search bar input
    document.getElementById('search-bar').addEventListener('input', handleSearch);

    // Add an event listener for the 'load' event to call loadProjects when the page is reloaded
    window.addEventListener('load', loadProjects);

    // Export functions for testing or external use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { loadProjects, displayProjects, handlePageChange, handleSearch, deleteProject };
    }
});