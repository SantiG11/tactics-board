const players = document.getElementsByClassName('player');
// const playersContainer = document.getElementsByClassName('players-container')

const court = document.getElementById('court')

for (let i = 0; i < players.length; i++) {

    const player = players[i];
    player.draggable = "true"

    player.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text', e.target.id);
    })

}

court.addEventListener('dragover', e => {
    e.preventDefault();
})

court.addEventListener('drop', e => {
    e.preventDefault();


    const draggedId = e.dataTransfer.getData("text");
    const draggedElement = document.getElementById(draggedId);

    // Calculate the position of the drop within the big div
    const x = e.clientX - court.offsetLeft - draggedElement.offsetWidth / 2;
    const y = e.clientY - court.offsetTop - draggedElement.offsetHeight / 2;

    // Prevent divs from being placed outside the big div
    const newX = Math.max(0, Math.min(x, court.offsetWidth - draggedElement.offsetWidth));
    const newY = Math.max(0, Math.min(y, court.offsetHeight - draggedElement.offsetHeight));

    draggedElement.style.position = "absolute";
    draggedElement.style.left = `${newX}px`;
    draggedElement.style.top = `${newY}px`;

    court.appendChild(draggedElement);

})