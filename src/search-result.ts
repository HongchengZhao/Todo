import { Todo } from './model';
import * as Utils from './utils';
import TodoEditor from './todo-editor';
import TodoList from './todo-list';

class SearchResult extends TodoList {
    searchEl: HTMLInputElement;
    titleEl: HTMLElement;
    secEl: HTMLElement;

    constructor(todoList: Todo[], editor: TodoEditor, el: HTMLElement, searchEl: HTMLInputElement) {
        super(todoList, editor, el);
        this.searchEl = searchEl;
        this.secEl = document.getElementsByClassName('search-sec')[0] as HTMLElement;
        this.titleEl = document.querySelector('.searching>span') as HTMLElement;

        this.render = this.render.bind(this);

        this.searchEl.addEventListener('keyup', () => {
            this.secEl.style.order = '-2';
            this.render();
        });

        window.addEventListener('click', (ev)=>{
            const target = ev.target as HTMLElement;
            if (target !== this.secEl) this.secEl.style.order = '0';
        });

        this.render();
    }

    render() {
        if (!this.searchEl) return;

        this.checkDueDate();

        Utils.removeAllChildren(this.el);
        const keyword = this.searchEl.value;
        this.titleEl.innerText = keyword;
        const res = this.list.filter(todo => todo.title.includes(keyword));
        this.el.append(...res.map(todo => this.createTodoItem(todo)));
    }
}

export default SearchResult;