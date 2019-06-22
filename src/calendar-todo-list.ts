import { Todo } from './model';
import * as Utils from './utils';
import Calendar from './calendar';
import TodoEditor from './todo-editor';
import TodoList from './todo-list';

class CalenderTodoList extends TodoList {
    calendar: Calendar
    constructor(todoList: Todo[], editor: TodoEditor, calendar: Calendar, el: HTMLElement) {

        super(todoList, editor, el);
        this.calendar = calendar;

        this.handleDayChange = this.handleDayChange.bind(this);
        this.calendar.el.addEventListener('click', this.handleDayChange);
        this.render();
    }

    render() {
        if (!this.calendar) return;

        this.checkDueDate();
        Utils.removeAllChildren(this.el);

        const listOfDay = this.list.filter((todo) => {
            if (!todo.dueDate) return false;
            const duedate = new Date(todo.dueDate.toString());

            const { year, month, day } = this.calendar.selected;
            return duedate.getFullYear() === year && duedate.getMonth() + 1 === month && duedate.getDate() === day;
        });
        this.el.append(...listOfDay.map(todo => this.createTodoItem(todo)));
    }

    handleDayChange(ev: Event) {
        const target = ev.target as HTMLElement;

        // find todo items due on the selected day
        if (target && target.classList.contains('this-month')) {
            this.render();
        }
    }
}

export default CalenderTodoList;