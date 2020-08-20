const game = document.querySelector('.game');

const board = game.querySelector('.board');
const interactiveItems = [...board.querySelectorAll('.board__item')];
const cells = [...game.querySelectorAll('.game__cell')];

let interactiveElement = null;
let droppableElement = null;
let dragging = false;

const checkTask = async task => {
    task.classList.add('task_checking');

    const value = [...task.children].map(element => element.innerText).join('')

    const { status } = await fetch('/check-solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ value })
    })
        .then(e => e.json());

    task.classList.remove('task_checking');

    if (status === 'incorrect') {
        task.classList.add('task_incorrect');
        setTimeout(() => task.classList.remove('task_incorrect'), 2000);
        return;
    }

    task.classList.add('task_correct');
    setTimeout(() => task.classList.remove('task_correct'), 2000);
};

const dragStart = event => {
    interactiveElement = event.target;
    dragging = true;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', drop);

    if (!interactiveElement) return;

    const { top, left } = interactiveElement.getBoundingClientRect();
    interactiveElement.style.top = `${top}px`;
    interactiveElement.style.left = `${left}px`;

    interactiveElement.classList.add('board__item_grabbing');
};

const drag = event => {
    if (!interactiveElement) return;

    interactiveElement.style.top = `${event.clientY}px`;
    interactiveElement.style.left = `${event.clientX}px`;
}

const dropOver = event => {
    if (!dragging) return;
    if (event.target.innerText && !event.target.classList.contains('game__cell_editable')) return;

    event.target.classList.add('game__cell_droppable');
    droppableElement = event.target;
}

const dropOut = event => {
    if (event.target === droppableElement) droppableElement = null;
    event.target.classList.remove('game__cell_droppable');
}

const drop = event => {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', drop);

    if (!interactiveElement) return;

    interactiveElement.style.top = null;
    interactiveElement.style.left = null;

    interactiveElement.classList.remove('board__item_grabbing');

    const value = interactiveElement.innerText;

    dragging = false;
    interactiveElement = null;

    if (!droppableElement) return;

    droppableElement.innerText = value;
    droppableElement.classList.add('game__cell_editable');

    checkTask(droppableElement.parentElement);

    droppableElement = null;
};

interactiveItems.forEach(item => item.addEventListener('mousedown', dragStart));
cells.forEach(cell => cell.addEventListener('mouseout', dropOut));
cells.forEach(cell => cell.addEventListener('mouseover', dropOver));
