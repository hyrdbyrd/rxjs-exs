import { fromEvent } from 'rxjs';
import {switchMap, takeUntil, map} from "rxjs/operators";

const dragNDropElem = document.getElementById('drag-n-drop');

const getCoords = (elem, event = {}) => {
    const { width, height, left, top } = elem.getBoundingClientRect();

    const {
        clientX = left,
        clientY = top
    } = event;

    return {
        left: `${clientX - width / 2}px`,
        top: `${clientY - height / 2}px`
    }
};

const mouseDown$ = fromEvent(dragNDropElem, 'mousedown');
const mouseMove$ = fromEvent(document, 'mousemove');
const mouseUp$ = fromEvent(document, 'mouseup');

mouseDown$.subscribe(event => {
    const { left, top }  = getCoords(event.target, event);

    event.target.style.top = top;
    event.target.style.left = left;
    event.target.style.position = 'absolute';
});

const dragging$ = mouseDown$
    .pipe(
        switchMap(mouseDownEvent => mouseMove$.pipe(
            takeUntil(mouseUp$),
            map(mouseMoveEvent => ({
                element: mouseDownEvent.target,
                event: mouseMoveEvent
            }))
        ))
    );

dragging$.subscribe(({ element, event }) => {
    const { left, top }  = getCoords(dragNDropElem, event);

    dragNDropElem.style.top = top;
    dragNDropElem.style.left = left;
});
