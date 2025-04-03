let fish1; let fish2; 
let canvasWidth;
let canvasHeight;

function getRandomColor() {
    let r = random(255); 
    let g = random(255); 
    let b = random(255); 
    return color(r, g, b);
  }

function setup() {
    canvasWidth = windowWidth * 0.5;
    canvasHeight = windowHeight * 0.5;
    createCanvas(canvasWidth, canvasHeight);
    fish1 = new Fish();  
    fish2 = new Fish();
}

function draw() {
    background(200);
    fish1.appear();
    fish1.update();

    fish2.appear();
    fish2.update();
}



