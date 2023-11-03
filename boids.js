const canvas = document.getElementById('boidsCanvas');
const ctx = canvas.getContext('2d');

let mouse = { x: undefined, y: undefined };

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boid {
    constructor() {
        this.position = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
        this.velocity = { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 };
        this.radius = 5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    
    separation() {
        let desiredSeparation = 25;
        let steer = { x: 0, y: 0 };
        let count = 0;

        for (let boid of boids) {
            let d = Math.hypot(this.position.x - boid.position.x, this.position.y - boid.position.y);

            if ((d > 0) && (d < desiredSeparation)) {
                let diff = { x: this.position.x - boid.position.x, y: this.position.y - boid.position.y };
                steer.x += diff.x;
                steer.y += diff.y;
                count++;
            }
        }

        if (count > 0) {
            steer.x /= count;
            steer.y /= count;
        }

        return steer;
    }
    
    alignment() {
        let neighborDist = 50;
        let sum = { x: 0, y: 0 };
        let count = 0;

        for (let boid of boids) {
            let d = Math.hypot(this.position.x - boid.position.x, this.position.y - boid.position.y);

            if ((d > 0) && (d < neighborDist)) {
                sum.x += boid.velocity.x;
                sum.y += boid.velocity.y;
                count++;
            }
        }

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;
        }

        return sum;
    }
    
    cohesion() {
        let neighborDist = 50;
        let sum = { x: 0, y: 0 };
        let count = 0;

        for (let boid of boids) {
            let d = Math.hypot(this.position.x - boid.position.x, this.position.y - boid.position.y);

            if ((d > 0) && (d < neighborDist)) {
                sum.x += boid.position.x;
                sum.y += boid.position.y;
                count++;
            }
        }

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;

            return { x: (sum.x - this.position.x) * 0.01, y: (sum.y - this.position.y) * 0.01 };
        } else {
            return { x: 0, y: 0 };
        }
    }
    update() {
        let separation = this.separation();
        let alignment = this.alignment();
        let cohesion = this.cohesion();
    
        this.velocity.x += separation.x + alignment.x + cohesion.x;
        this.velocity.y += separation.y + alignment.y + cohesion.y;

        // Limit velocity
        const speed = Math.hypot(this.velocity.x, this.velocity.y);
        const maxSpeed = 3;
        if (speed > maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * maxSpeed;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    
        // Boundary conditions to keep boids on screen
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.y > canvas.height) this.position.y = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
    }
}


// Create 100 boids
const boids = [];

for (let i = 0; i < 100; i++) {
    boids.push(new Boid());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let boid of boids) {
        boid.draw();
        boid.update();
        // TODO: Update Boid behavior here
    }
    
    requestAnimationFrame(animate);
}

animate();
