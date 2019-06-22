function removeAllChildren(el: HTMLElement) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

function listenToSwipe(directoin: string, el: HTMLElement, listener: (ev: TouchEvent) => any) {
    const startPos = { x: 0, y: 0 };
    el.addEventListener('touchstart', (ev) => {
        startPos.x = ev.touches[0].clientX;
        startPos.y = ev.touches[0].clientY;
    });

    el.addEventListener('touchend', (ev) => {
        const diffX = ev.changedTouches[0].clientX - startPos.x;
        const diffY = ev.changedTouches[0].clientY - startPos.y;

        switch (directoin) {
            case 'left':
                if (diffX < 0 && Math.abs(diffX) > 30 && Math.abs(diffY) < 20) {
                    listener(ev);
                }
                break;
            default:
                break;
        }
    })
}

function delegate(target: HTMLElement, src: HTMLElement, type: string, handler: (ev: Event) => void) {
    target.addEventListener(type, (ev) => {
        for (const el of ev.composedPath()) {
            if (el === src) {
                handler.call(src, ev);
                break;
            }
        }
    });
}

export { removeAllChildren, listenToSwipe, delegate };