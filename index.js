const canvasEl = document.querySelector("canvas");
const c = canvasEl.getContext("2d")
const scoreEl = document.getElementById("scoreEl")
const bigScoreEl = document.getElementById("bigScoreEl")
const startGameBtn = document.getElementById("startGameBtn");
const modalEl = document.getElementById("modalEl");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;

class Player{
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * this.radius, false);
        c.fillStyle = this.color;
        c.fill()
    }
}

class Projectile{
    constructor(x,y,radius,color,velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * this.radius, false);
        c.fillStyle = this.color;
        c.fill()
    }
    update(){
        this.draw()
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y
    }
}
class Enemy{
    constructor(x,y,radius,color,velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * this.radius, false);
        c.fillStyle = this.color;
        c.fill()
    }
    update(){
        this.draw()
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y
    }
}

class Particle{
    constructor(x,y,radius,color,velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1
    }
    draw(){
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * this.radius, false);
        c.fillStyle = this.color;
        c.fill()
        c.restore()
    }
    update(){
        this.draw()
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01 
    }
}

function spawnEnemies(){
    setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
     let x = Math.random() < 0.5 ? 0 - radius : canvasEl.width + radius 
     let y = Math.random() < 0.5 ? 0 - radius : canvasEl.height + radius 
     if(Math.random < 0.5){
         x = Math.random() < 0.5 ? 0 - radius : canvasEl.width + radius 
         y = Math.random() * canvasEl.height 
     }else{
        x = Math.random() * canvasEl.width
        y = Math.random() < 0.5 ? 0 - radius : canvasEl.height + radius 
     }
     const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
     const angle = Math.atan2(canvasEl.height /2 - y ,canvasEl.width / 2 - x);
     const velocity = {
         x: Math.cos(angle),
         y: Math.sin(angle)
     }
     enemies.push(new Enemy(x,y,radius,color,velocity))
    }, 1000)
}

const x = canvasEl.width / 2;
const y = canvasEl.height / 2
let player
let projectiles;
let particles;
let enemies;
let score;
function init(){
 score=0;
 scoreEl.innerHTML = score;
 bigScoreEl.innerHTML = score;
 player = new Player(x,y, 10,"white");
 projectiles = [];
 particles = [];
 enemies = [];
}

window.addEventListener("click", (e) => {
    const angle = Math.atan2(e.clientY - canvasEl.height /2 ,e.clientX - canvasEl.width / 2);
    const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4,
    }
   projectiles.push(new Projectile(canvasEl.width / 2, canvasEl.height / 2, 5, "white", velocity))
})
let animationId;

function animate(){
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0,0,0,0.1)';
    c.fillRect(0,0,canvasEl.width,canvasEl.height)
    player.draw();
    particles.forEach((particle,ind) => {
        if(particle.alpha < 0){
            particles.splice(ind, 1)
        }else{
            particle.update();
        }
    })
    projectiles.forEach((p,indx) => {
       p.update()

       if(p.x + p.radius < 0 || p.x - p.radius > canvasEl.width || p.y + p.radius < 0 || p.y - p.radius > canvasEl.height){
           setTimeout(() => {
               p.splice(indx, 1);
           },0)
       }
   })
   enemies.forEach((enemy,indx) => {
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      if(dist - enemy.radius - player.radius < 1){
           cancelAnimationFrame(animationId)
           modalEl.style.display="flex";
           bigScoreEl.innerHTML = score;
      }
       enemy.update();

       projectiles.forEach((projectile,i) => {
           const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
           if(dist - enemy.radius - projectile.radius < 1){
               for(let i =0;i< enemy.radius;i++){
                   particles.push(new Particle(projectile.x,projectile.y,Math.random() * 2,enemy.color,
                    {
                        x: (Math.random() - 0.5) * (Math.random() * 8),
                        y: (Math.random() - 0.5) * (Math.random() * 8),
                    }))
               }
               if(enemy.radius - 10 > 5){
                   score +=100;
                   scoreEl.innerHTML = score
                   gsap.to(enemy, {
                       radius: enemy.radius - 10
                   })
                setTimeout(() => {
                    projectiles.splice(i,1);
                  },0)
               }else{
                score +=250;
                scoreEl.innerHTML = score
                setTimeout(() => {
                    enemies.splice(indx, 1);
                    projectiles.splice(i,1);
                  },0)
               }
             
           }
       })
   })
}
startGameBtn.addEventListener("click",() => {
    init();
    animate()
    spawnEnemies();
    modalEl.style.display = "none";
})
