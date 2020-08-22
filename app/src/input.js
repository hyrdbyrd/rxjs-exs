const input = document.getElementById('secret');

const debounce = (func, time) => {
    let timeout;
    return (...args) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(func.bind(func, ...args), time);
    };
};

const onInput = event => {
    const { value } = event.target;

    event.target.classList.add('secret_status_loading');

    fetch('/validate-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
    })
        .then(e => e.json())
        .then(({ status }) => event.target.className = `secret_status_${status}`);
};

const debouncedOnInput = debounce(onInput, 2000);

input.addEventListener('input', event => {
    event.target.className = '';
    debouncedOnInput(event);
});
