document.addEventListener('DOMContentLoaded', () => {
    const projectData = JSON.parse(localStorage.getItem('projectData')) || {};
    const currentProjectKey = projectData.current_project;

    const getTextOrDefault = (value, defaultText) => {
        if (typeof value === 'string' && value.trim()) {
            return value;
        } else if (typeof value === 'object' && Object.keys(value).length > 0) {
            return JSON.stringify(value, null, 2);
        } else {
            return defaultText;
        }
    };

    const sanitizeHTML = (input) => {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.body.textContent || "";
    };

    const toggleEditMode = (element, btn, type) => {
        const isEditing = element.getAttribute('contenteditable') === 'true';
        if (isEditing) {
            element.setAttribute('contenteditable', 'false');
            btn.innerHTML = "<i class='bx bx-edit'></i>";
            btn.classList.add('edit');
            btn.classList.remove('save');
            saveChanges(element, btn, type);
            if (type === 'todo') {
                renderMarkup(element);
            }
        } else {
            element.setAttribute('contenteditable', 'true');
            btn.innerHTML = "<i class='bx bx-save'></i>";
            btn.classList.add('save');
            btn.classList.remove('edit');
            if (type === 'todo') {
                restoreOriginalText(element, type);
            }
            element.focus();
        }
        element.parentElement.classList.toggle('editing', !isEditing);
    };

    const saveChanges = (element, btn, type) => {
        if (type === 'todo') {
            projectData.project_data[currentProjectKey].TodoList = element.innerText;
        } else if (type === 'branch') {
            let link = element.innerText.trim();
            if (!link.startsWith('http://') && !link.startsWith('https://')) {
                link = 'https://' + link;
            }
            projectData.project_data[currentProjectKey].BranchLink = link;
            document.querySelector('.project-branch-link').href = link;
        }
        localStorage.setItem('projectData', JSON.stringify(projectData));
        element.parentElement.classList.add('saved');
        showSaveConfirmation(btn);
    };

    const showSaveConfirmation = (btn) => {
        btn.innerHTML = "<i class='bx bx-check-square'></i>";
        btn.classList.add('check');
        setTimeout(() => {
            btn.innerHTML = "<i class='bx bx-edit'></i>";
            btn.classList.remove('check');
            btn.classList.add('edit');
            btn.parentElement.classList.remove('saved');
        }, 2000);
    };

    const renderMarkup = (element) => {
        let text = sanitizeHTML(element.innerText);
        text = text.replace(/(\n|^) {3}- \[ \] (.+)/g, '$1<div class="indent"><input type="checkbox" disabled> $2</div>')
                   .replace(/(\n|^) {3}- \[x\] (.+)/gi, '$1<div class="indent"><input type="checkbox" checked disabled> $2</div>')
                   .replace(/(\n|^)- \[ \] (.+)/g, '$1<div><input type="checkbox" disabled> $2</div>')
                   .replace(/(\n|^)- \[x\] (.+)/gi, '$1<div><input type="checkbox" checked disabled> $2</div>');
        element.innerHTML = text;
    };

    const restoreOriginalText = (element, type) => {
        let text;
        if (type === 'todo') {
            text = projectData.project_data[currentProjectKey].TodoList;
        } else if (type === 'branch') {
            text = projectData.project_data[currentProjectKey].BranchLink;
        }
        element.innerText = text;
    };

    if (currentProjectKey && projectData.project_data[currentProjectKey]) {
        const currentProject = projectData.project_data[currentProjectKey];

        document.querySelector('.project-text').innerText = currentProject.projectName || 'PROJECT NAME';
        document.querySelector('.project-todo-list').innerText = getTextOrDefault(currentProject.TodoList, 'TODO LIST (Each task with a progress bar and link to a github issue)');
        document.querySelector('.project-branch-link').innerText = currentProject.BranchLink || 'Link to Branch/Workspace';
        document.querySelector('.project-branch-link').href = currentProject.BranchLink || '#';
        document.querySelector('.project-branch-link').target = '_blank';
        document.querySelector('.project-detail-div').innerText = currentProject.projectDescription || 'Project Details, Members (add hover feature/description)';

        renderMarkup(document.querySelector('.project-todo-list'));

        document.querySelector('.todo-edit-btn').addEventListener('click', () => {
            const todoList = document.querySelector('.project-todo-list');
            toggleEditMode(todoList, document.querySelector('.todo-edit-btn'), 'todo');
        });

        document.querySelector('.branch-edit-btn').addEventListener('click', () => {
            const branchLink = document.querySelector('.project-branch-link');
            toggleEditMode(branchLink, document.querySelector('.branch-edit-btn'), 'branch');
        });
    } else {
        document.querySelector('.project-text').innerText = 'PROJECT NAME';
        document.querySelector('.project-todo-list').innerText = 'TODO LIST (Each task with a progress bar and link to a github issue)';
        document.querySelector('.project-branch-link').innerText = 'Link to Branch/Workspace';
        document.querySelector('.project-branch-link').href = '#';
        document.querySelector('.project-branch-link').target = '_blank';
        document.querySelector('.project-detail-div').innerText = 'Project Details, Members (add hover feature/description)';
    }

    const setDefaultText = (selector, defaultText) => {
        const element = document.querySelector(selector);
        if (!element.innerText.trim() || element.innerText === '[object Object]' || element.innerText === '{}') {
            element.innerText = defaultText;
        }
    };

    setDefaultText('.project-text', 'PROJECT NAME');
    setDefaultText('.project-todo-list', 'TODO LIST (Each task with a progress bar and link to a github issue)');
    setDefaultText('.project-branch-link', 'Link to Branch/Workspace');
    setDefaultText('.project-detail-div', 'Project Details, Members (add hover feature/description)');
});
