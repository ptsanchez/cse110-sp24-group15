document.addEventListener('DOMContentLoaded', function () {
    const projectsPerPage = 5;
    let currentPage = 1;
    let projects = [];
    sessionStorage.setItem('current_page', currentPage);

    function loadProjects() {
        let projData = JSON.parse(localStorage.getItem("project_data"));
        projects = Object.entries(projData.project_data).filter(([key, project]) => !project.active);
        sessionStorage.setItem("archived_projects", JSON.stringify(projects));
        displayProjects();
    }

    function displayProjects() {
        const projectList = document.querySelector('.project-list');
        projectList.innerHTML = '';
        const start = (currentPage - 1) * projectsPerPage;
        const end = start + projectsPerPage;
        const paginatedProjects = projects.slice(start, end);
        
        paginatedProjects.forEach(([key, project]) => {
            let listItem = document.createElement('li');
            listItem.classList.add('project');
            listItem.innerHTML = `
                <span>${project.projectName}</span>
                <button class="delete-btn">Delete</button>
            `;
            listItem.querySelector('.delete-btn').addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering the project click event
                deleteProject(key);
            });
            listItem.addEventListener('click', () => {
                let projData = JSON.parse(localStorage.getItem("project_data"));
                projData.current_project = key;
                localStorage.setItem('project_data', JSON.stringify(projData));
                window.location.href = "../projects/projectHomePage/project_home_page.html";
            });
            projectList.appendChild(listItem);
        });
    }

    function deleteProject(projectKey) {
        // Remove from projects array
        projects = projects.filter(([key, project]) => key !== projectKey);
        
        // Update sessionStorage
        sessionStorage.setItem('archived_projects', JSON.stringify(projects));

        // Update localStorage
        let projData = JSON.parse(localStorage.getItem("project_data"));
        delete projData.project_data[projectKey];
        localStorage.setItem('project_data', JSON.stringify(projData));

        // Redisplay projects
        displayProjects();
    }

    function handlePageChange(direction) {
        const totalPages = Math.ceil(projects.length / projectsPerPage);
        currentPage = Math.max(1, Math.min(currentPage + direction, totalPages));
        sessionStorage.setItem('current_page', currentPage);
        displayProjects();
    }

    function handleSearch() {
        const searchQuery = document.getElementById('search-bar').value.toLowerCase();
        projects = JSON.parse(sessionStorage.getItem('archived_projects')).filter(([key, project]) => 
            project.projectName.toLowerCase().includes(searchQuery));
        currentPage = 1;
        sessionStorage.setItem('current_page', currentPage);
        displayProjects();
    }

    document.querySelector('.page-back-btn').addEventListener('click', () => handlePageChange(-1));
    document.querySelector('.page-next-btn').addEventListener('click', () => handlePageChange(1));
    document.getElementById('search-bar').addEventListener('input', handleSearch);

    loadProjects();

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { loadProjects, displayProjects, handlePageChange, handleSearch, deleteProject };
    }
});
