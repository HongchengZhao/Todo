class TimePicker {
    timePicker: HTMLElement;
    hourPicker: HTMLSelectElement;
    minutePicker: HTMLSelectElement;

    constructor(timePicker: HTMLElement) {
        this.timePicker = timePicker;
        this.hourPicker = document.createElement('select');
        this.hourPicker.classList.add('hour-picker');
        this.renderHourPicker();

        this.minutePicker = document.createElement('select');
        this.minutePicker.classList.add('minute-picker');
        this.renderMinutePicker();

        const text = document.createTextNode(':');

        this.timePicker.append(this.hourPicker, text, this.minutePicker);
    }

    renderHourPicker() {
        const options = [];
        for (let i = 0; i < 24; ++i) {
            const option = document.createElement('option');
            option.value = `${i}`;
            option.innerText = `${i}`;
            options.push(option);
        }

        this.hourPicker.append(...options);
    }

    renderMinutePicker() {
        const options = [];
        for (let i = 0; i < 60; ++i) {
            const option = document.createElement('option');
            option.value = `${i}`;
            option.innerText = `${i}`;
            options.push(option);
        }

        this.minutePicker.append(...options);
    }
}

export default TimePicker;