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
}

const mouseMove = event => {
    const { left, top } = getCoords(dragNDropElem, event);

    dragNDropElem.style.left = left;
    dragNDropElem.style.top = top;
};

const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
};

const mouseDown = event => {
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    const { left, top }  = getCoords(dragNDropElem, event);

    dragNDropElem.style.top = top;
    dragNDropElem.style.left = left;
    dragNDropElem.style.position = 'absolute';
};

dragNDropElem.addEventListener('mousedown', mouseDown);
