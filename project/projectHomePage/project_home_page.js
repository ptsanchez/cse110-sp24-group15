document.addEventListener('DOMContentLoaded', () => {
    const projectData = JSON.parse(localStorage.getItem('projectData')) || {};
    const currentProjectKey = projectData.current_project;

    // Utility function to get text or default value 
    const getTextOrDefault = (value, defaultText) => {
        if (typeof value === 'string' && value.trim()) {
            return value;
        } else if (typeof value === 'object' && Object.keys(value).length > 0) {
            return JSON.stringify(value, null, 2);
        } else {
            return defaultText;
        }
    };

    // Function to toggle edit mode for todo list and branch link
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

    // Function to save changes to local storage
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

    // Function to show save confirmation (check logo)
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

    // Function to render markup for todo list (checkbox markup)
    const renderMarkup = (element) => {
        let text = element.innerText;
        const tempDiv = document.createElement('div');
        text.split('\n').forEach(line => {
            let match;

            // if the line starts with '# '
            match = line.match(/^# (.+)/);
            if (match) {
                const boldText = document.createElement('strong');
                boldText.textContent = match[1];
                tempDiv.appendChild(boldText);
                tempDiv.appendChild(document.createElement('br'));
                return;
            }
            
            // if the line has three space indentation and - [ ]
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

            // if the line has three space indentation and - [X]
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

            // if the line has only - [ ]
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

            // if the line has only - [X]
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

    // Function to restore the original text for edit mode
    // To display normal markup text like - [ ] or - [X] not checkbox
    const restoreOriginalText = (element, type) => {
        let text;
        if (type === 'todo') {
            text = projectData['project_data'][String(currentProjectKey)]['TodoList'];
        } else if (type === 'branch') {
            text = projectData['project_data'][String(currentProjectKey)]['BranchLink'];
        }
        element.textContent = text;
    };

    // Load project data from local storage if available
    if (currentProjectKey && projectData['project_data'][String(currentProjectKey)]) {
        const currentProject = projectData['project_data'][String(currentProjectKey)];

        document.querySelector('.project-text').textContent = currentProject.projectName || 'PROJECT NAME';
        document.querySelector('.project-todo-list').textContent = getTextOrDefault(currentProject.TodoList, 'Enter your markdown here...\n\n\n');
        document.querySelector('.project-branch-link').textContent = currentProject.BranchLink || 'Enter your link to branch/workspace here...\n\n\n';
        document.querySelector('.project-branch-link').href = currentProject.BranchLink || '#';
        document.querySelector('.project-branch-link').target = '_blank';
        document.querySelector('.project-detail-div').textContent = currentProject.projectDescription || 'Project Details, Members';

        renderMarkup(document.querySelector('.project-todo-list'));

        // Event listeners for edit buttons
        document.querySelector('.todo-edit-btn').addEventListener('click', () => {
            const todoList = document.querySelector('.project-todo-list');
            toggleEditMode(todoList, document.querySelector('.todo-edit-btn'), 'todo');
        });

        document.querySelector('.branch-edit-btn').addEventListener('click', () => {
            const branchLink = document.querySelector('.project-branch-link');
            toggleEditMode(branchLink, document.querySelector('.branch-edit-btn'), 'branch');
        });

        // Allow double-click to edit TODO list
        document.querySelector('.project-todo-list').addEventListener('dblclick', () => {
            const todoList = document.querySelector('.project-todo-list');
            const editBtn = document.querySelector('.todo-edit-btn');
            if (todoList.getAttribute('contenteditable') === 'false') {
                toggleEditMode(todoList, editBtn, 'todo');
            }
        });

        // Allow double-click to edit Branch Link
        document.querySelector('.project-link-div').addEventListener('dblclick', () => {
            const branchLink = document.querySelector('.project-branch-link');
            const editBtn = document.querySelector('.branch-edit-btn');
            if (branchLink.getAttribute('contenteditable') === 'false') {
                toggleEditMode(branchLink, editBtn, 'branch');
            }
        });
    } else {
        document.querySelector('.project-text').textContent = 'PROJECT NAME';
        document.querySelector('.project-todo-list').textContent = 'Enter your markdown here...\n\n\n';
        document.querySelector('.project-branch-link').textContent = 'Enter your link to branch/workspace here...\n\n\n';
        document.querySelector('.project-branch-link').href = '#';
        document.querySelector('.project-branch-link').target = '_blank';
        document.querySelector('.project-detail-div').textContent = 'Project Details, Members';
    }

    // Function to set default text if necessary
    const setDefaultText = (selector, defaultText) => {
        const element = document.querySelector(selector);
        const elementText = element.textContent.trim();
        const isDefaultRequired = !elementText || elementText === '[object Object]' || elementText === '{}';
        if (isDefaultRequired) {
            element.textContent = defaultText;
        }
    };

    setDefaultText('.project-text', 'PROJECT NAME');
    setDefaultText('.project-todo-list', 'Enter your markdown here...\n\n\n');
    setDefaultText('.project-branch-link', 'Enter your link to branch/workspace here...\n\n\n');
    setDefaultText('.project-detail-div', 'Project Details, Members');
});