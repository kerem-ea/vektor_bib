let fishArray = [];
let canvasWidth;
let canvasHeight;
let alignmentConstant = 1;
let cohesionConstant = 1;
let separationConstant = 1;

let sliders = [];

function getRandomColor() {
    let r = random(255); 
    let g = random(255); 
    let b = random(255); 
    return color(r, g, b);
}

function drawSliders() {
    const sliderConfig = [
        { label: 'Alignment', yPos: 0.05 },
        { label: 'Separation', yPos: 0.1 },
        { label: 'Cohesion', yPos: 0.15 }
    ];

    for (let i = 0; i < sliderConfig.length; i++) {
        let config = sliderConfig[i];
        let slider = createSlider(1, 100, 1);
        slider.position(canvasWidth * 0.02, canvasHeight * config.yPos);
        slider.size(80);
        sliders.push({ slider: slider, label: config.label });
    }
}

function manageSliders() {
    alignmentConstant = sliders[0].slider.value();
    separationConstant = sliders[1].slider.value();
    cohesionConstant = sliders[2].slider.value();
}

function setup() {
    canvasWidth = windowWidth * 0.5;
    canvasHeight = windowHeight * 0.5;
    createCanvas(canvasWidth, canvasHeight);
    drawSliders();

    for (let i = 0; i < 5; i++) {
        fishArray.push(new Fish());
        if (i % 5 === 0) {
            fishArray.push(new PredatorFish());
        }
    }
}

function draw() {
    background(100, 150, 255);

    for (let i = 0; i < sliders.length; i++) {
        let sliderObj = sliders[i];
        push();
        fill(0, 0, 0);
        textSize(windowWidth * 0.01)
        textAlign(LEFT, CENTER);
        text(sliderObj.label, sliderObj.slider.x + sliderObj.slider.width, sliderObj.slider.y + sliderObj.slider.height / 2);
        pop();
    }

    manageSliders();

    for (let i = 0; i < fishArray.length; i++) {
        let fish = fishArray[i];
        fish.appear();
        fish.update();
    }
}
