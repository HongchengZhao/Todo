import { Todo, Status } from './model';
import * as Utils from './utils';
import TodoEditor from './todo-editor';

class TodoList {
    list: Todo[];
    el: HTMLElement;
    editor: TodoEditor;
    curTodoId: string = '';
    swipedLeft: HTMLElement | null = null;

    constructor(todoList: Todo[], editor: TodoEditor, el: HTMLElement) {
        this.list = todoList;
        this.editor = editor;
        this.el = el;
        this.render = this.render.bind(this);

        // bind handlers
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSwipeLeft = this.handleSwipeLeft.bind(this);

        this.init();
    }

    init() {
        this.render();
        this.el.addEventListener('click', this.handleClick);
        this.el.addEventListener('change', this.handleChange);
        Utils.listenToSwipe('left', this.el, this.handleSwipeLeft);

        this.editor.el.addEventListener('editorClosed', (ev) => {
            this.render();
        });

        const newTodo = document.getElementById('new-todo') as HTMLInputElement;
        newTodo.addEventListener('keypress', (ev) => {
            if (ev.key === 'Enter') {
                const title = newTodo.value.trim();
                const todo = new Todo(title);
                this.list.unshift(todo);

                this.el.insertBefore(this.createTodoItem(todo), this.el.firstElementChild);
            }
        });

        window.addEventListener('click', () => {
            if (this.swipedLeft) this.swipedLeft.hidden = true;
        });
    }

    render(filter: string = 'ALL') {
        const todos = filter === 'ALL' ? this.list : this.list.filter(todo => Status[todo.status] === filter);
        Utils.removeAllChildren(this.el);

        this.el.append(...todos.map(todo => this.createTodoItem(todo)));
    }

    createTodoItem(todo: Todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item', todo.status === Status.ACTIVE ? 'todo-active' : 'todo-completed');
        li.setAttribute('data-id', todo.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.status === Status.COMPLETED ? true : false;
        checkbox.classList.add('toggle-status');

        const todoInfo = document.createElement('div');
        todoInfo.classList.add('todo-info');
        todoInfo.innerText = todo.title;

        const actions = document.createElement('div');
        actions.classList.add('todo-actions');
        actions.hidden = true;

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-button');
        editBtn.innerHTML = `<i class="material-icons">edit</i>`;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('del-button');
        deleteBtn.innerHTML = `<i class="material-icons">delete_forever</i>`;

        actions.append(editBtn, deleteBtn);

        li.append(checkbox, todoInfo, actions);
        return li;
    }

    handleClick(ev: MouseEvent) {
        for (const el of (ev.composedPath() as HTMLElement[])) {

            if (el.classList && el.classList.contains('del-button')) {
                /*
                 * delete todo item
                 */
                const li = (el.parentElement as HTMLElement).parentElement as HTMLElement;
                this.list.splice(this.list.findIndex(todo => todo.id === li.getAttribute('data-id')), 1);
                li.remove();
                break;
            } else if (el.classList && el.classList.contains('edit-button')) {
                /*
                 * edit todo item
                 */
                const li = (el.parentElement as HTMLElement).parentElement as HTMLElement;
                this.curTodoId = li.getAttribute('data-id') || '';
                this.editor.open(this.curTodoId);
                break;
            }
        }
    }

    /*
     * handle status change
     */
    handleChange(ev: Event) {
        const target = ev.target as HTMLElement;
        const li = target.parentElement;
        if (li && li.classList.contains('todo-item')) {
            const todo = this.list.find(todo => todo.id === li.getAttribute('data-id'));
            if (todo) {
                todo.status = todo.status === Status.ACTIVE ? Status.COMPLETED : Status.ACTIVE;
                li.classList.toggle('todo-completed');
            }
        }
    }

    handleSwipeLeft(ev: TouchEvent) {
        for (const el of (ev.composedPath() as HTMLElement[])) {
            if (el.classList.contains('todo-item')) {
                if (this.swipedLeft) this.swipedLeft.hidden = true;

                this.swipedLeft = el.getElementsByClassName('todo-actions')[0] as HTMLElement;
                this.swipedLeft.hidden = false;
                break;
            }
        }
    }
}

export default TodoList;