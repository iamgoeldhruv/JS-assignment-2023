const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = 400;

const gameSpeed = 0.2
const deathAudio = new Audio('./game-assets/death.mp3')
const jumpAudio = new Audio('./game-assets/jump.mp3')

const deathImage = new Image();
deathImage.src = './game-assets/game-over.webp';


const backgroundImage = new Image();
backgroundImage.src = "./game-assets/background.png"
class Background{
    constructor(img){
        this.width = 4374
        this.height = 400
        this.Image = img
        this.position = {
            x:0,
            y:0
        }
    }

    draw(){
        ctx.drawImage(this.Image , this.position.x , this.position.y)
    }
}
const background = new Background(backgroundImage);

class Mario {
    constructor(){
        this.position = {
            x:100,
            y: 0
        }
        this.velocity = {
            x:0,
            y:gameSpeed*2,
        }
        this.width = 18
        this.height = 18
        this.gravity = 0.5
    }
    
    draw(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x , this.position.y , this.width , this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if( this.position.y + this.height + this.velocity.y <= canvas.height ){ 
            this.velocity.y += this.gravity
        }
        else this.velocity.y = 0
        if(this.position.x < 0){
            this.velocity.x = 0
            this.position.x =0
        }
        if(this.position.y < 0){
            this.velocity.y = 0;
            this.position.y = 0
        }
        
    }
}

class DeathImage{
    constructor(){
        this.position = {
            x : canvas.width/2,
            y : canvas.height/2
        }
    }
    draw(){
        ctx.drawImage(deathImage , this.position.x , this.position.y)
    }
}

class Enemies {
    constructor(x , y , height, width){
        this.position = {
            x,
            y
        }
        this.width = width
        this.height = height
        this.maxWidth = width
    }

    draw(){
        ctx.fillStyle  = 'rgba(255 , 255 , 255, 0)'
        ctx.fillRect(this.position.x , this.position.y , this.width , this.height);
    }
}

const enemies  = [ new Enemies(246  , 181 , 50 , 65) , new Enemies(945 , 184 , 32 , 56) ];

const deathAnimation = new DeathImage();

class Platform {
    constructor( x , y , width){
        this.position = {
            x,
            y
        }
        this.width = width
        this.height = 0
        this.maxWidth = width
    }
    draw(){
        ctx.fillRect(this.position.x ,this.position.y , this.width , this.height);
    }
}
//, new Platform( 495 , 320 ,95)
        
const platforms = [
    new Platform( 0, 346 ,423) , new Platform( 486 , 320 ,95) , 
    new Platform(641 , 242 , 208 ) , new Platform(696 ,133 , 125) , 
    new Platform(857  ,  320 ,  71) , new Platform(937 , 214 , 125) ,
    new Platform(1070 , 107 ,178), new Platform(1337 , 347 , 99) ,
    new Platform( 1577 , 347 , 125 ) , new Platform(1603 , 134 , 99),
    new Platform(1737 , 347 , 125) ,  new Platform(1870 , 240 , 72),
    new Platform(2030 , 160 , 152) , new Platform(2617 , 294 , 98),
    new Platform(2777 , 187 ,205) , new Platform(3017 , 347 , 72),
    new Platform(3097 , 240 , 99) , new Platform( 3257 , 240 , 98),
    new Platform(3440 , 347 , 240) ,   new Platform(3680 , 241 , 54),
    new Platform(3734 , 187 , 54) , new Platform(3787 , 134 , 54),
    new Platform(3840 , 346 , 348)
] 
const mario = new Mario(); 
const keys = {
    right : {
        pressed:false
    },
    left : {
        pressed:false
    }
}
  let upKeystokes = 0;

let death = false

const deathSequence = ()=>{
    death=true
    const playFunc = async ()=>{
        await deathAudio.play()
    }
    playFunc();
    mario.velocity.y = -10
    setTimeout(()=>{
        location.href = "/death.html"
    } , 500)
    
}

function animate (){
    requestAnimationFrame(animate);
    ctx.clearRect( 0 , 0 , canvas.width , canvas.height)
    background.draw();
     
    platforms.forEach((platform)=>{
        //console.log(platform.width - mario.position.x)1002 ,  
        platform.draw();
    })
    mario.update();
    if(keys.right.pressed && (mario.position.x <= 400)) {
        mario.velocity.x =gameSpeed 
    }
    else if (keys.left.pressed && mario.position.x > 100) {
        mario.velocity.x = -gameSpeed 
    }
    else {
        mario.velocity.x = 0
    }

    //enemies 
    enemies.forEach((enemie) =>{
        enemie.draw()
    })

    enemies.forEach((enemie) =>{
       
        if(enemie.width <= 0){
            enemie.width = 0 ;
        }
        if(keys.right.pressed && background.position.x <= 0 && background.position.x > -3900){
            console.log(enemie.position.x)
            console.log(enemie.width)
            background.position.x -= gameSpeed
                if(enemie.width > 0 && enemie.position.x ===  0){
                enemie.width -= gameSpeed;
                }
                enemie.position.x -=(platforms.length + enemies.length) * gameSpeed 
        }else if(keys.left.pressed && background.position.x < 0){
            background.position.x += gameSpeed
            if(enemie.width < enemie.maxWidth && background.position.x > -enemie.maxWidth && enemie.position.x === 0){
                enemie.width += gameSpeed
            } 
            
                enemie.position.x += (platforms.length + enemies.length) * gameSpeed 
        } else if(background.position.x > 0){
            background.position.x = 0
        }
    })
        
    
    //if statement for background image and platform movement
    platforms.forEach((platform) =>{
        if(platform.width <= 0){
            platform.width = 0 ;
        }
        if(keys.right.pressed && background.position.x <= 0 && background.position.x > -3900){
            background.position.x -= gameSpeed
                if(platform.width > 0 && platform.position.x ===  0){
                     platform.width -= gameSpeed;
                }
                platform.position.x -=(platforms.length + enemies.length)* gameSpeed
        }else if(keys.left.pressed && background.position.x < 0){
            background.position.x += gameSpeed
            if(platform.width < platform.maxWidth && background.position.x > -platform.maxWidth && platform.position.x === 0){
                platform.width += gameSpeed
            } 
            
                platform.position.x +=( platforms.length + enemies.length)*gameSpeed
        } else if(background.position.x > 0){
            background.position.x = 0
        }
    })

    //death sequence
    
  
   
    //collison detection 
    platforms.forEach((platform)=>{
        if((mario.position.x + mario.width >= platform.position.x) && 
        (mario.position.y + mario.height <= platform.position.y) &&
        (mario.position.y + mario.height + mario.velocity.y >= platform.position.y)&&
        (mario.position.x <= platform.position.x + platform.width)
        ){
            mario.velocity.y = 0
        }
    })

    //collision detection for enemies 
    enemies.forEach((enemie)=>{
        console.log(enemie.position.y + enemie.height )
        console.log(mario.position.y)
        if((mario.position.x + mario.width >= enemie.position.x) && 
        (mario.position.y  <= enemie.position.y + enemie.height) &&
        (mario.position.x <= enemie.position.x + enemie.width)
        ){
           deathSequence();
        }
    })

    if(mario.position.y  > 375){
        deathSequence();
    }
  
    
}



animate()

window.addEventListener('keydown' , ({ keyCode }) =>{
     switch (keyCode){
        case 38:
            if( upKeystokes < 10){
               mario.velocity.y -= 6
               }
            break;
        case 39:
            if(!death){
            upKeystokes = 0
            keys.right.pressed = true;
            }
            break;
        case 37:
            if(!death){
            upKeystokes = 0
            keys.left.pressed = true;
            }
            break
    } 
})

window.addEventListener('keyup' , ({ keyCode }) =>{
    switch (keyCode){
       case 38:
           upKeystokes++
           if(upKeystokes < 10){
            mario.velocity.y -= 6
           }
           break;
       case 39:
           keys.right.pressed = false;
           break;
       case 37:
           keys.left.pressed = false;
           break
   } 
   
})


