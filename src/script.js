const court = document.getElementById('court')
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear-btn')
const undoBtn = document.getElementById('undo-btn')

const players = document.getElementsByClassName('player');



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


    const x = e.clientX - court.offsetLeft - draggedElement.offsetWidth / 2;
    const y = e.clientY - court.offsetTop - draggedElement.offsetHeight / 2;


    const newX = Math.max(0, Math.min(x, court.offsetWidth - draggedElement.offsetWidth));
    const newY = Math.max(0, Math.min(y, court.offsetHeight - draggedElement.offsetHeight));

    draggedElement.style.position = "absolute";
    draggedElement.style.left = `${newX}px`;
    draggedElement.style.top = `${newY}px`;

    court.appendChild(draggedElement);

})

canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mouseleave', stopDrawing)
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas)
clearBtn.addEventListener('click', clearCanvas)
undoBtn.addEventListener('click', undo)

let isDrawing = false
let startX, startY
let lastX = 0
let lastY = 0
let imageData = []

function undo() {

    if (imageData.length > 1) {
        imageData.pop()
        console.log('image deleted', imageData)
        ctx.putImageData(imageData[imageData.length - 1], 0, 0)
    } else {
        console.log('canvas empty')
    }


}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    imageData.push(data)
    console.log('image pushed', imageData)
}

function resizeCanvas() {
    canvas.width = court.offsetWidth - 35;
    canvas.height = court.offsetHeight - 35;

}

function startDrawing(event) {
    isDrawing = true

    const rect = canvas.getBoundingClientRect();
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;

    lastX = startX;
    lastY = startY;
    if (imageData.length < 1) {
        let data = ctx.getImageData(0, 0, canvas.width, canvas.height);

        imageData.push(data)
        console.log('image pushed', imageData)

    }



}

function draw(event) {
    if (!isDrawing) return

    const rect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    ctx.lineWidth = 3

    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke();

    lastX = offsetX;
    lastY = offsetY;

}


function stopDrawing(event) {
    if (!isDrawing) return
    isDrawing = false
    // imageData.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    imageData.push(data)
    console.log('image pushed', imageData)
}

