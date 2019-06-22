enum Status {
    ACTIVE,
    COMPLETED
}

class Todo {
    readonly id = Date.now() + Math.random().toString(36).substring(2);
    title: string;
    dueDate: Date | null;
    detail: string;
    reminderTime: Date | null;
    status: Status;
    pinned: boolean = false;

    constructor(title: string, dueDate: Date | null = null, reminderTime: Date | null = null) {
        this.title = title;
        this.dueDate = dueDate;
        this.reminderTime = reminderTime;
        this.detail = '';
        this.status = Status.ACTIVE;
    }
}


export { Todo, Status };