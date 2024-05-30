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
        let text = element.innerText;
        const tempDiv = document.createElement('div');
        text.split('\n').forEach(line => {
            let match;
            if (match = line.match(/^ {3}- \[ \] (.+)/)) {
                const div = document.createElement('div');
                div.classList.add('indent');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.disabled = true;
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(` ${match[1]}`));
                tempDiv.appendChild(div);
            } else if (match = line.match(/^ {3}- \[x\] (.+)/i)) {
                const div = document.createElement('div');
                div.classList.add('indent');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.disabled = true;
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(` ${match[1]}`));
                tempDiv.appendChild(div);
            } else if (match = line.match(/^- \[ \] (.+)/)) {
                const div = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.disabled = true;
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(` ${match[1]}`));
                tempDiv.appendChild(div);
            } else if (match = line.match(/^- \[x\] (.+)/i)) {
                const div = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.disabled = true;
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(` ${match[1]}`));
                tempDiv.appendChild(div);
            } else {
                tempDiv.appendChild(document.createTextNode(line));
                tempDiv.appendChild(document.createElement('br'));
            }
        });
        element.innerHTML = '';
        element.appendChild(tempDiv);
    };

    const restoreOriginalText = (element, type) => {
        let text;
        if (type === 'todo') {
            text = projectData.project_data[currentProjectKey].TodoList;
        } else if (type === 'branch') {
            text = projectData.project_data[currentProjectKey].BranchLink;
        }
        element.textContent = text;
    };

    if (currentProjectKey && projectData.project_data[currentProjectKey]) {
        const currentProject = projectData.project_data[currentProjectKey];

        document.querySelector('.project-text').textContent = currentProject.projectName || 'PROJECT NAME';
        document.querySelector('.project-todo-list').textContent = getTextOrDefault(currentProject.TodoList, 'TODO LIST (Each task with a progress bar and link to a github issue)');
        document.querySelector('.project-branch-link').textContent = currentProject.BranchLink || 'Link to Branch/Workspace';
        document.querySelector('.project-branch-link').href = currentProject.BranchLink || '#';
        document.querySelector('.project-branch-link').target = '_blank';
        document.querySelector('.project-detail-div').textContent = currentProject.projectDescription || 'Project Details, Members (add hover feature/description)';

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
        document.querySelector('.project-text').textContent = 'PROJECT NAME';
        document.querySelector('.project-todo-list').textContent = 'TODO LIST (Each task with a progress bar and link to a github issue)';
        document.querySelector('.project-branch-link').textContent = 'Link to Branch/Workspace';
        document.querySelector('.project-branch-link').href = '#';
        document.querySelector('.project-branch-link').target = '_blank';
        document.querySelector('.project-detail-div').textContent = 'Project Details, Members (add hover feature/description)';
    }

    const setDefaultText = (selector, defaultText) => {
        const element = document.querySelector(selector);
        if (!element.textContent.trim() || element.textContent === '[object Object]' || element.textContent === '{}') {
            element.textContent = defaultText;
        }
    };

    setDefaultText('.project-text', 'PROJECT NAME');
    setDefaultText('.project-todo-list', 'TODO LIST (Each task with a progress bar and link to a github issue)');
    setDefaultText('.project-branch-link', 'Link to Branch/Workspace');
    setDefaultText('.project-detail-div', 'Project Details, Members (add hover feature/description)');
});
