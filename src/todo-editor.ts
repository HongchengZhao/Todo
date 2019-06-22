import { Todo } from './model';
import Calendar from './calendar';
import TimePicker from './timepicker';

class TodoEditor {
    list: Todo[];
    el: HTMLElement;
    duedatePicker: Calendar;
    alarmDatePicker: Calendar;
    alarmTimePicker: TimePicker;
    curTodoId: string = '';
    editorClosed: Event;

    constructor(todolist: Todo[]) {
        this.list = todolist;
        this.el = document.getElementById('details') as HTMLElement;
        this.editorClosed = new Event('editorClosed');
        this.duedatePicker = new Calendar(document.getElementById('due-date-picker') as HTMLElement);
        this.alarmDatePicker = new Calendar(document.getElementById('alarm-picker') as HTMLElement);
        this.alarmTimePicker = new TimePicker(document.getElementById('time-picker') as HTMLElement);

        // bind handlers
        this.handleClick = this.handleClick.bind(this);

        this.init();
    }

    init() {
        this.el.addEventListener('click', this.handleClick);

        const editTitle = document.getElementById('edit-todo-title');
        editTitle && editTitle.addEventListener('blur', (ev) => {
            const todo = this.list.find(todo => todo.id === this.curTodoId);
            if (todo) todo.title = (editTitle as HTMLInputElement).value;
        });

        const todoDetails = document.getElementById('todo-details');
        todoDetails && todoDetails.addEventListener('blur', (ev) => {
            const todo = this.list.find(todo => todo.id === this.curTodoId);
            if (todo) todo.detail = (todoDetails as HTMLTextAreaElement).value;
        });
    }

    /*
     * open editor
     */
    open(todoId: string) {
        this.curTodoId = todoId;
        const todo = this.list.find(todo => todo.id === todoId);
        if (todo) {
            const title = this.el.querySelector('input[name=todo-title]') as HTMLInputElement;
            if (title) title.value = todo.title;

            const dueDate = this.el.querySelector('label[for=due-date-control]') as HTMLElement;

            if (todo.dueDate) {
                const duedate = new Date(todo.dueDate.toString());
                dueDate.innerText = `Due on ${duedate.toDateString()}`;
            }

            const reminderTime = this.el.querySelector('label[for=alarm-control]') as HTMLElement;
            if (todo.reminderTime) {
                const reminder = new Date(todo.reminderTime.toString());
                reminderTime.innerHTML =
                    `<span>Remind me at ${reminder.toLocaleTimeString()}</span><span>On ${reminder.toDateString()}</span>`;
            }

            const detail = document.getElementById('todo-details') as HTMLTextAreaElement;
            if (todo.detail) detail.value = todo.detail;
        }
        this.el.classList.add('show');
    }

    close() {
        this.el.classList.remove('show');
        this.el.dispatchEvent(this.editorClosed);
    }

    handleClick(ev: MouseEvent) {
        for (const el of (ev.composedPath() as HTMLElement[])) {
            if (el.classList && el.classList.contains('close-editor')) {
                this.close();
                break;
            } else if (el.classList && el.classList.contains('due-date-save')) {
                const dueDate = this.el.querySelector('label[for=due-date-control]') as HTMLElement;
                const { year, month, day } = this.duedatePicker.selected;
                const datetime = new Date(year, month - 1, day);
                dueDate.innerText = `Due on ${datetime.toDateString()}`;

                const todo = this.list.find(todo => todo.id === this.curTodoId);
                if (todo) todo.dueDate = datetime;
                break;
            } else if (el.classList && el.classList.contains('due-date-cancel')) {
                const duedateControl = document.getElementById('due-date-control') as HTMLInputElement;
                if (duedateControl) duedateControl.checked = false;
                break;
            } else if (el.classList && el.classList.contains('reminder-save')) {
                const reminderTime = this.el.querySelector('label[for=alarm-control]') as HTMLElement;
                const { year, month, day } = this.alarmDatePicker.selected;
                if (year === 0) break;

                const hour = parseInt(this.alarmTimePicker.hourPicker.value);
                const min = parseInt(this.alarmTimePicker.minutePicker.value);
                const datetime = new Date(year, month - 1, day, hour, min);

                reminderTime.innerHTML = `<span>Remind me at ${datetime.toLocaleTimeString()}</span> 
                <span>On ${datetime.toDateString()}</span>`;

                const todo = this.list.find(todo => todo.id === this.curTodoId);
                if (todo) todo.reminderTime = datetime;
                break;
            } else if (el.classList && el.classList.contains('reminder-cancel')) {
                const alarmControl = document.getElementById('alarm-control') as HTMLInputElement;
                if (alarmControl) alarmControl.checked = false;
                break;
            }
        }
    }
}

export default TodoEditor;