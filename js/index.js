console.log("index.js loaded");

<div id="date-buttons"></div>


    const dateButtonsContainer = document.getElementById('date-buttons');
    const today = new Date();

    for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const button = document.createElement('button');
    button.textContent = i === 0 ? 'Today' : date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    dateButtonsContainer.appendChild(button);
}

