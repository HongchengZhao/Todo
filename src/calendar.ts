class Calendar {
    el: HTMLElement;
    calendarIndicator: HTMLElement;
    calendarHead: HTMLElement;
    calendarBody: HTMLElement;
    month: number;
    year: number;
    selected = {
        year: 0,
        month: 0,
        day: 0
    };
    static months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    constructor(calendar: HTMLElement) {
        this.el = calendar;

        this.calendarIndicator = document.createElement('div');
        this.calendarIndicator.classList.add('calendar-indicator');
        this.renderIndicator();

        this.calendarHead = document.createElement('div');
        this.calendarHead.classList.add('calendar-head');
        this.renderHead();


        this.calendarBody = document.createElement('div');
        this.calendarBody.classList.add('calendar-body');
        const tody = new Date();
        this.month = tody.getMonth() + 1;
        this.year = tody.getFullYear();
        this.renderBody(this.month, this.year);

        this.selected.day = tody.getDate();
        this.selected.month = this.month;
        this.selected.year = this.year;

        this.el.append(this.calendarIndicator, this.calendarHead, this.calendarBody);
    }

    renderIndicator() {
        const prev = document.createElement('div');
        prev.innerText = '❮';
        prev.classList.add('prev-month');
        const cur = document.createElement('h3');
        cur.classList.add('current-month');
        const next = document.createElement('div');
        next.classList.add('next-month');
        next.innerText = '❯';

        this.calendarIndicator.append(prev, cur, next);

        this.calendarIndicator.addEventListener('click', (ev) => {
            const target = ev.target as HTMLElement;

            if (target.classList.contains('prev-month')) {
                if (--this.month === 0) {
                    this.month = 12;
                    this.year -= 1;
                }
                this.renderBody(this.month, this.year);
            } else if (target.classList.contains('next-month')) {
                if (++this.month === 13) {
                    this.month = 1;
                    this.year += 1;
                }
                this.renderBody(this.month, this.year);
            }
        });
    }

    renderHead() {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const headChildren = weekdays.map(day => {
            const weekday = document.createElement('div');
            weekday.classList.add('weekday');
            weekday.innerText = day;
            return weekday;
        });
        this.calendarHead.append(...headChildren);
    }

    renderBody(month: number, year: number) {
        while (this.calendarBody.firstChild) this.calendarBody.removeChild(this.calendarBody.firstChild);
        const curMonth = this.calendarIndicator.getElementsByClassName('current-month')[0];
        curMonth.innerHTML = `${Calendar.months[month - 1]} ${year}`;

        const days = this.daysInMonth(month, year);

        const dayCells: HTMLElement[] = [];

        for (let key = 0; key < days; ++key) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('cell-day', 'this-month');
            dayCell.innerText = `${key + 1}`;
            dayCells.push(dayCell);
        }

        const today = new Date();
        if (this.year === today.getFullYear() && this.month === today.getMonth() + 1) {
            dayCells[today.getDate() - 1].classList.add('selected');
        }

        const weekdayOfFirstDay = new Date(year, month, 1).getUTCDay() || 7;
        for (let i = 1; i < weekdayOfFirstDay; ++i) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('cell-day');
            dayCells.unshift(dayCell);
        }
        this.calendarBody.append(...dayCells);

        this.calendarBody.addEventListener('click', (ev) => {
            const target = ev.target as HTMLElement;
            if (target.classList.contains('this-month')) {
                const selected = this.calendarBody.getElementsByClassName('selected')[0];
                selected && selected.classList.remove('selected');
                target.classList.add('selected');
                this.selected.day = parseInt(target.innerText);
                this.selected.month = this.month;
                this.selected.year = this.year;
            }
            console.log(this.selected);
        });
    }

    daysInMonth(month: number, year: number) {
        return new Date(year, month, 0).getDate();
    }
}

export default Calendar;