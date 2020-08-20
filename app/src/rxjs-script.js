import { fromEvent, Subject, from } from 'rxjs';
import { map, switchMap, takeUntil, mapTo, switchMapTo, tap, delay } from 'rxjs/operators';

const game = document.querySelector('.game');

const board = game.querySelector('.board');
const interactiveItems = [...board.querySelectorAll('.board__item')];
const cells = [...game.querySelectorAll('.game__cell')];

const taskChecker$ = new Subject()
    .pipe(
        switchMap(task => {
            task.className = 'task task_checking';
            const value = [...task.children].map(element => element.innerText).join('');

            const request = fetch('/check-solve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify({ value })
            })
                .then(e => e.json());

            return from(request).pipe(
                tap(({ status }) => {
                    task.classList.add(`task_${status}`);
                    task.classList.remove('task_checking');
                }),
                delay(2000),
                tap(({ status }) => task.classList.remove(`task_${status}`))
            );
        })
    );

taskChecker$.subscribe();

const mouseDown$ = fromEvent(interactiveItems, 'mousedown');
const mouseMove$ = fromEvent(document, 'mousemove');
const mouseUp$ = fromEvent(document, 'mouseup');

const mouseOver$ = fromEvent(cells, 'mouseover');
const mouseOut$ = fromEvent(cells, 'mouseout');

const drop$ = mouseDown$.pipe(
    switchMapTo(mouseOver$.pipe(
        takeUntil(mouseUp$),
        switchMap(mouseOverEvent => mouseUp$.pipe(mapTo(mouseOverEvent)))
    )),
);

const hover$ = mouseDown$.pipe(switchMapTo(mouseOver$.pipe(takeUntil(mouseUp$))));

mouseDown$.subscribe(({ clientY, clientX, target }) => {
    target.style.top = `${clientY}px`;
    target.style.left = `${clientX}px`;
    target.classList.add('board__item_grabbing');
});

// On hover
hover$.subscribe(({ target }) => !target.innerText && target.classList.add('game__cell_droppable'));
// On out
mouseOut$.subscribe(event => event.target.classList.remove('game__cell_droppable'));
drop$.subscribe(event => event.target.classList.remove('game__cell_droppable'));

// Drop handle
drop$
    .subscribe(({ target }) => {
        const interactiveElement = document.querySelector('.board__item_grabbing');
        if (!interactiveElement) return;

        interactiveElement.classList.remove('board__item_grabbing');
        interactiveElement.style.top = null;
        interactiveElement.style.left = null;

        if (!target) return;

        target.innerText = interactiveElement.innerText;
        target.classList.add('game__cell_editable');
    });

drop$.subscribe(({ target }) => taskChecker$.next(target.parentElement));

// Dragging
mouseDown$
    .pipe(
        switchMap(dragEvent => mouseMove$.pipe(
            takeUntil(mouseUp$),
            map(event => ({
                x: event.clientX,
                y: event.clientY,
                target: dragEvent.target
            }))
        ))
    )
    .subscribe(({ target, x, y }) => {
        target.style.top = `${y}px`;
        target.style.left = `${x}px`;
    });
