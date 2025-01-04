
//Drag and drop section
const court = document.getElementById('court')
const ball = document.getElementById('ball')
const players = document.getElementsByClassName('player');
const attackPlayers = document.getElementsByClassName('attack');
const defensePlayers = document.getElementsByClassName('defense');


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

    const courtRect = court.getBoundingClientRect();

    const x = e.clientX - courtRect.left - draggedElement.offsetWidth / 2;
    const y = e.clientY - courtRect.top - draggedElement.offsetHeight / 2;


    const newX = Math.max(0, Math.min(x, courtRect.width - draggedElement.offsetWidth));
    const newY = Math.max(0, Math.min(y, courtRect.height - draggedElement.offsetHeight));

    draggedElement.style.position = "absolute";
    draggedElement.style.left = `${newX}px`;
    draggedElement.style.top = `${newY}px`;
    draggedElement.style.transform = 'none';

    court.appendChild(draggedElement);
})


//Customization section

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


//Drawing section

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear-btn')
const undoBtn = document.getElementById('undo-btn')
const resetBtn = document.getElementById('reset-btn')


canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mouseleave', stopDrawing)
window.addEventListener('load', () => {
    resizeCanvas()
    loadDrawings()
}
);
window.addEventListener('resize', () => { resizeCanvas(), loadDrawings() })

resetBtn.addEventListener('click', resetCanvas)
clearBtn.addEventListener('click', clearCanvas)
undoBtn.addEventListener('click', undo)

let isDrawing = false

let imageData = []
let color = '#000'
let lineWidth = 2
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
        // ctx.lineJoin = 'round';
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

function resetCanvas() {
    imageData = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveDrawings();
}

function resizeCanvas() {
    canvas.width = court.offsetWidth;
    canvas.height = court.offsetHeight;
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

function saveDrawings() {
    localStorage.setItem('basketballTacticsDrawings', JSON.stringify(imageData));
}

function loadDrawings() {
    const savedDrawings = localStorage.getItem('basketballTacticsDrawings');
    if (savedDrawings) {
        imageData = JSON.parse(savedDrawings);
        redrawCanvas();
    }
}




