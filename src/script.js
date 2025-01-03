const court = document.getElementById('court')
const ball = document.getElementById('ball')
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear-btn')
const undoBtn = document.getElementById('undo-btn')

const players = document.getElementsByClassName('player');
const attackPlayers = document.getElementsByClassName('attack');
const defensePlayers = document.getElementsByClassName('defense');
const defenseBgColorPicker = document.getElementById('background-defense-color')
const attackBgColorPicker = document.getElementById('background-attack-color')
const defenseTxtColorPicker = document.getElementById('text-defense-color')
const attackTxtColorPicker = document.getElementById('text-attack-color')

attackBgColorPicker.addEventListener('change', (e) => {
    Array.from(attackPlayers).forEach(player => {
        player.style.backgroundColor = e.target.value
    });
})

attackTxtColorPicker.addEventListener('change', (e) => {
    Array.from(attackPlayers).forEach(player => {
        player.style.color = e.target.value
    });
})

defenseBgColorPicker.addEventListener('change', (e) => {
    Array.from(defensePlayers).forEach(player => {
        player.style.backgroundColor = e.target.value
    });
})

defenseTxtColorPicker.addEventListener('change', (e) => {
    Array.from(defensePlayers).forEach(player => {
        player.style.color = e.target.value
    });
})

for (let i = 0; i < players.length; i++) {

    const player = players[i];

    player.max
    player.draggable = "true"

    player.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text', e.target.id);
    })

}

ball.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text', e.target.id);
})

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
let color = '#000'
let lineWidth = 3
let currentStroke = []

function getPointFromEvent(e, isNewStroke = false) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / canvas.width,
        y: (e.clientY - rect.top) / canvas.height,
        color: color,
        lineWidth: lineWidth,
        isNewStroke: isNewStroke
    };
}

function startDrawing(e) {
    isDrawing = true

    const newPoint = getPointFromEvent(e, true);
    currentStroke = [newPoint];

    ctx.beginPath();
    ctx.arc(newPoint.x * canvas.width, newPoint.y * canvas.height, newPoint.lineWidth / 2, 0, 2 * Math.PI);
    ctx.fillStyle = newPoint.color;
    ctx.fill();
}

function draw(e) {
    if (!isDrawing) return

    const newPoint = getPointFromEvent(e);
    currentStroke.push(newPoint);

    if (currentStroke.length > 1) {
        const prevPoint = currentStroke[currentStroke.length - 2];
        ctx.beginPath();
        ctx.moveTo(prevPoint.x * canvas.width, prevPoint.y * canvas.height);
        ctx.lineTo(newPoint.x * canvas.width, newPoint.y * canvas.height);
        ctx.strokeStyle = newPoint.color;
        ctx.lineWidth = newPoint.lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

function stopDrawing(e) {
    if (!isDrawing) return
    isDrawing = false
    if (currentStroke.length > 0) {
        imageData.push({ points: currentStroke });
        currentStroke = [];
        saveDrawings();
    }
}


function undo() {
    if (imageData.length > 0) {
        imageData.pop();
        redrawCanvas();
        saveDrawings();
    }
}

function clearCanvas() {
    imageData.push({ clear: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveDrawings();
}

function resizeCanvas() {
    canvas.width = court.offsetWidth - 35;
    canvas.height = court.offsetHeight - 35;
    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    imageData.forEach(stroke => {

        if (stroke.clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        if (stroke.points.length < 2) return;

        ctx.beginPath();
        stroke.points.forEach((point, index) => {
            if (index === 0 || point.isNewStroke) {
                ctx.moveTo(point.x * canvas.width, point.y * canvas.height);
            } else {
                ctx.lineTo(point.x * canvas.width, point.y * canvas.height);
            }
            ctx.strokeStyle = point.color;
            ctx.lineWidth = point.lineWidth;
            ctx.lineCap = 'round';
        });
        ctx.stroke();
    });
}






