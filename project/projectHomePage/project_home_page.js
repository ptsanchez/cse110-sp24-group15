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
        const isNowEditing = !isEditing;
        element.parentElement.classList.toggle('editing', isNowEditing);
    };

    const saveChanges = (element, btn, type) => {
        if (type === 'todo') {
            projectData['project_data'][String(currentProjectKey)]['TodoList'] = element.innerText;
        } else if (type === 'branch') {
            let link = element.innerText.trim();
            const hasHttp = link.startsWith('http://');
            const hasHttps = link.startsWith('https://');
            if (!hasHttp && !hasHttps) {
                link = 'https://' + link;
            }
            projectData['project_data'][String(currentProjectKey)]['BranchLink'] = link;
            const branchLinkElement = document.querySelector('.project-branch-link');
            branchLinkElement.href = link;
        }
        localStorage.setItem('projectData', JSON.stringify(projectData));
        const parentElement = element.parentElement;
        parentElement.classList.add('saved');
        showSaveConfirmation(btn);
    };

    const showSaveConfirmation = (btn) => {
        btn.innerHTML = "<i class='bx bx-check-square'></i>";
        btn.classList.add('check');
        setTimeout(() => {
            btn.innerHTML = "<i class='bx bx-edit'></i>";
            btn.classList.remove('check');
            btn.classList.add('edit');
            const parentElement = btn.parentElement;
            parentElement.classList.remove('saved');
        }, 2000);
    };

    const renderMarkup = (element) => {
        let text = element.innerText;
        const tempDiv = document.createElement('div');
        text.split('\n').forEach(line => {
            let match;
            match = line.match(/^ {3}- \[ \] (.+)/);
            if (match) {
                const div = document.createElement('div');
                div.classList.add('indent');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.disabled = true;
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(` ${match[1]}`));
                tempDiv.appendChild(div);
                return;
            }
            match = line.match(/^ {3}- \[x\] (.+)/i);
            if (match) {
                const div = document.createElement('div');
                div.classList.add('indent');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.disabled = true;
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(` ${match[1]}`));
                tempDiv.appendChild(div);
                return;
            }
            match = line.match(/^- \[ \] (.+)/);
            if (match) {
                const div = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.disabled = true;
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(` ${match[1]}`));
                tempDiv.appendChild(div);
                return;
            }
            match = line.match(/^- \[x\] (.+)/i);
            if (match) {
                const div = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.disabled = true;
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(` ${match[1]}`));
                tempDiv.appendChild(div);
                return;
            }
            tempDiv.appendChild(document.createTextNode(line));
            tempDiv.appendChild(document.createElement('br'));
        });
        element.innerHTML = '';
        element.appendChild(tempDiv);
    };

    const restoreOriginalText = (element, type) => {
        let text;
        if (type === 'todo') {
            text = projectData['project_data'][String(currentProjectKey)]['TodoList'];
        } else if (type === 'branch') {
            text = projectData['project_data'][String(currentProjectKey)]['BranchLink'];
        }
        element.textContent = text;
    };

    if (currentProjectKey && projectData['project_data'][String(currentProjectKey)]) {
        const currentProject = projectData['project_data'][String(currentProjectKey)];

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
        const elementText = element.textContent.trim();
        const isDefaultRequired = !elementText || elementText === '[object Object]' || elementText === '{}';
        if (isDefaultRequired) {
            element.textContent = defaultText;
        }
    };

    setDefaultText('.project-text', 'PROJECT NAME');
    setDefaultText('.project-todo-list', 'TODO LIST (Each task with a progress bar and link to a github issue)');
    setDefaultText('.project-branch-link', 'Link to Branch/Workspace');
    setDefaultText('.project-detail-div', 'Project Details, Members (add hover feature/description)');
});