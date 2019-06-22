import { Todo, Status } from './model';
import TodoEditor from './todo-editor';
import Calendar from './calendar';
import TodoList from './todo-list';
import CalendarTodoList from './calendar-todo-list';

class App {
    todoList: TodoList;
    editor: TodoEditor;
    calendarTodoList: CalendarTodoList;
    curTodoId = '';

    constructor() {
        // Load data from local storage
        const res = localStorage.getItem('todolist');
        const list = res ? JSON.parse(res) : [];
        this.editor = new TodoEditor(list);
        this.todoList = new TodoList(list, this.editor, document.getElementById('todo-list') as HTMLUListElement);

        const calendar = new Calendar(document.getElementById('calendar') as HTMLElement);
        this.calendarTodoList = new CalendarTodoList(list, this.editor, calendar, document.getElementById('todolist-by-day') as HTMLElement);

        this.init();
    }

    init() {
        this.configRoutes();

        const filters = document.getElementById('filters') as HTMLElement;
        filters.addEventListener('change', (ev) => {
            const target = ev.target as HTMLInputElement;
            const selected = document.querySelector('.filter.selected');
            selected && selected.classList.remove('selected');

            (target.parentElement as HTMLInputElement).classList.add('selected');

            if (target.name === 'filter') {
                (document.getElementById('filter-options') as HTMLInputElement).checked = false;
                this.todoList.render(target.value);
            }
        });
        
        window.addEventListener('click', (ev) => {
            const target = ev.target as HTMLInputElement;
            if (target.id !== 'filter-options') {
                (document.getElementById('filter-options') as HTMLInputElement).checked = false;
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