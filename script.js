// Get the canvas element and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Park information
let visitorCount = 0;
let moneyAmount = 1000;
let attractions = [];
let visitors = [];
let player = new Player(100, 100);

// Visitor class
class Visitor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 40;
        this.speed = 1 + Math.random() * 2;
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 5, this.y + 10, 5, 5);
        ctx.fillRect(this.x + 10, this.y + 10, 5, 5);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.x += this.speed;
        if (this.x > canvas.width) {
            this.x = -this.width;
        }
    }
}

// Attraction class
class Attraction {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.type = type;
        this.revenue = 10; // Money earned per visitor
    }

    draw(ctx) {
        if (this.type === 'ferrisWheel') {
            // Draw Ferris wheel
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x + 50, this.y + 50, 50, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();

            ctx.fillStyle = 'blue';
            for (let i = 0; i < 8; i++) {
                const angle = i * (Math.PI / 4);
                const bx = this.x + 50 + Math.cos(angle) * 40;
                const by = this.y + 50 + Math.sin(angle) * 40;
                ctx.beginPath();
                ctx.arc(bx, by, 10, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }

            ctx.strokeStyle = 'black';
            for (let i = 0; i < 8; i++) {
                const angle = i * (Math.PI / 4);
                const bx = this.x + 50 + Math.cos(angle) * 40;
                const by = this.y + 50 + Math.sin(angle) * 40;
                ctx.beginPath();
                ctx.moveTo(this.x + 50, this.y + 50);
                ctx.lineTo(bx, by);
                ctx.stroke();
            }

        } else if (this.type === 'rollerCoaster') {
            // Draw Roller coaster
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width / 4, this.y);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height);
            ctx.lineTo(this.x + 3 * this.width / 4, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();

        } else if (this.type === 'carousel') {
            // Draw Carousel
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(this.x + 50, this.y + 50, 50, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();

            ctx.fillStyle = 'purple';
            for (let i = 0; i < 8; i++) {
                const angle = i * (Math.PI / 4);
                const bx = this.x + 50 + Math.cos(angle) * 40;
                const by = this.y + 50 + Math.sin(angle) * 40;
                ctx.beginPath();
                ctx.arc(bx, by, 10, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
        }
    }

    generateRevenue() {
        moneyAmount += this.revenue;
    }
}

// Player class (from Glaggleland)
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 40;
        this.speed = 5;
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        switch (direction) {
            case 'up':
                this.y -= this.speed;
                break;
            case 'down':
                this.y += this.speed;
                break;
            case 'left':
                this.x -= this.speed;
                break;
            case 'right':
                this.x += this.speed;
                break;
        }
    }
}

// Update sidebar with park information
function updateSidebar() {
    document.getElementById('visitorCount').textContent = visitorCount;
    document.getElementById('moneyAmount').textContent = moneyAmount;
}

// Add an attraction
function addAttraction() {
    if (moneyAmount >= 500) {
        const x = Math.random() * (canvas.width - 100);
        const y = Math.random() * (canvas.height - 100);
        const types = ['ferrisWheel', 'rollerCoaster', 'carousel'];
        const type = types[Math.floor(Math.random() * types.length)];
        const attraction = new Attraction(x, y, type);
        attractions.push(attraction);
        moneyAmount -= 500;
        updateSidebar();
    } else {
        console.error('Not enough money to add an attraction!');
    }
}

// Ensure the addAttraction function is properly closed
addAttraction();

// Handle keyboard input for player movement
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            player.move('up');
            break;
        case 'ArrowDown':
        case 's':
            player.move('down');
            break;
        case 'ArrowLeft':
        case 'a':
            player.move('left');
            break;
        case 'ArrowRight':
        case 'd':
            player.move('right');
            break;
    }
});

// Handle adding attraction on button click
document.getElementById('addAttraction').addEventListener('click', addAttraction);

// Initialize visitors
function initializeVisitors(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height - 40);
        const visitor = new Visitor(x, y);
        visitors.push(visitor);
    }
}

// Initialize visitors
initializeVisitors(10);

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    visitors.forEach(visitor => {
        visitor.move();
        visitor.draw(ctx);
    });
    attractions.forEach(attraction => {
        attraction.draw(ctx);
        attraction.generateRevenue();
    });
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
