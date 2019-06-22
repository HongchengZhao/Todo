import { Todo, Status } from './model';
import TodoEditor from './todo-editor';
import Calendar from './calendar';
import TodoList from './todo-list';
import SearchResult from './search-result';
import CalendarTodoList from './calendar-todo-list';

class App {
    list: Todo[];
    editor: TodoEditor;
    todoList: TodoList;
    calendarTodoList: CalendarTodoList;
    searchResult: TodoList;
    curTodoId = '';
    filter: string = 'ALL';

    constructor() {
        // Load data from local storage
        const res = localStorage.getItem('todolist');
        this.list = res ? JSON.parse(res) : [];
        this.editor = new TodoEditor(this.list);
        this.todoList = new TodoList(
            this.list,
            this.editor,
            document.getElementById('todo-list') as HTMLUListElement,
            document.getElementById('new-todo') as HTMLInputElement
        );

        const calendar = new Calendar(document.getElementById('calendar') as HTMLElement);
        this.calendarTodoList = new CalendarTodoList(
            this.list,
            this.editor,
            calendar,
            document.getElementById('todolist-by-day') as HTMLElement
        );

        this.searchResult = new SearchResult(
            this.list,
            this.editor,
            document.getElementById('result-list') as HTMLElement,
            document.getElementById('search-todo') as HTMLInputElement
        );

        this.init();
    }

    init() {
        this.configRoutes();

        (document.getElementById('complete-all') as HTMLElement).addEventListener('click', () => {
            this.list.forEach(todo => todo.status = Status.COMPLETED);
            this.todoList.render(this.filter);
        });

        (document.getElementById('uncomplete-all') as HTMLElement).addEventListener('click', () => {
            this.list.forEach(todo => todo.status = Status.ACTIVE);
            this.todoList.render(this.filter);
        });

        (document.getElementById('remove-all-completed') as HTMLElement).addEventListener('click', () => {
            const atciveItems = this.list.reduce((prev: any, todo) => {
                if (todo.status === Status.ACTIVE) prev.push(todo);
                return prev;
            }, []);
            this.list.splice(0, this.list.length);
            this.list.push(...atciveItems);
            this.todoList.render(this.filter);
        });

        const filters = document.getElementById('filters') as HTMLElement;
        filters.addEventListener('change', (ev) => {
            const target = ev.target as HTMLInputElement;
            const selected = document.querySelector('.filter.selected');
            selected && selected.classList.remove('selected');

            (target.parentElement as HTMLInputElement).classList.add('selected');

            if (target.name === 'filter') {
                (document.getElementById('filter-options') as HTMLInputElement).checked = false;
                this.filter = target.value;
                this.todoList.render(this.filter);
            }
        });

        window.addEventListener('click', (ev) => {
            const target = ev.target as HTMLInputElement;
            if (target.id !== 'filter-options') {
                (document.getElementById('filter-options') as HTMLInputElement).checked = false;
            }

            if (target.id !== 'operations-control') {
                (document.getElementById('operations-control') as HTMLInputElement).checked = false;
            }
        });
    }

    configRoutes() {
        const tasksNav = document.getElementById('route-tasks') as HTMLElement;
        const calendarNav = document.getElementById('route-calendar') as HTMLElement;
        const tasksSec = document.getElementById('tasks') as HTMLElement;
        const scheduleSec = document.getElementById('schedule') as HTMLElement;

        tasksNav.addEventListener('click', (ev) => {
            const currentSec = document.getElementsByClassName('current-sec')[0];
            currentSec.classList.remove('current-sec');
            tasksSec.classList.add('current-sec');
            calendarNav.classList.remove('nav-active');
            tasksNav.classList.add('nav-active');
            this.todoList.render();
            this.editor.el.classList.remove('show');
        });

        calendarNav.addEventListener('click', (ev) => {
            const currentSec = document.getElementsByClassName('current-sec')[0];
            currentSec.classList.remove('current-sec');
            scheduleSec.classList.add('current-sec');
            tasksNav.classList.remove('nav-active');
            calendarNav.classList.add('nav-active');
            this.calendarTodoList.render();
            this.editor.el.classList.remove('show');
        });

    }
}

window.addEventListener('load', () => {
    const app = new App();

    window.addEventListener('beforeunload', () => {
        localStorage.setItem('todolist', JSON.stringify(app.todoList.list));
    });
});