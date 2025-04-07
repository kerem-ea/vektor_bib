let fishArray = [];
let canvasWidth;
let canvasHeight;
let alignmentConstant = 20;
let cohesionConstant = 20;
let separationConstant = 5;

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
    
    for (let i = 0; i < 10; i++) {
        fishArray.push(new Fish());
    }
}

function draw() {
    background(100, 150, 255);

    for (let i = 0; i < fishArray.length; i++) {
        let fish = fishArray[i];
        fish.appear();
        fish.update();
    }
}



