let fishArray = [];
let canvasWidth;
let canvasHeight;
let alignmentConstant = 1;
let cohesionConstant = 1;
let separationConstant = 1;
let sliders = [];

function getRandomColor(type) {
    let r = 0; let g = 0; let b = 0;
    if (type === "Prey") {
        r = random(10, 30);
        g = random(100, 200);
        b = random(10, 30);
    }

    else if (type === "Pred") {
        r = random(100, 200);
        g = random(10, 30);
        b = random(10, 30);
    }

    return color(r, g, b);
}

function drawSliders() {
  const sliderConfig = [
    { label: 'Alignment', yPos: 0.05, default: 50 },
    { label: 'Separation', yPos: 0.10, default: 50 },
    { label: 'Cohesion', yPos: 0.15, default: 50 }
  ];

  for (let i = 0; i < sliderConfig.length; i++) {
    let cfg = sliderConfig[i];
    let slider = createSlider(1, 100, cfg.default);
    slider.position(canvasWidth * 0.02, canvasHeight * cfg.yPos);
    slider.size(80);
    sliders.push({ slider: slider, label: cfg.label });
  }
}

function manageSliders() {
  alignmentConstant  = sliders[0].slider.value();
  separationConstant = sliders[1].slider.value();
  cohesionConstant   = sliders[2].slider.value();
}

function setup() {
  canvasWidth = windowWidth * 0.5;
  canvasHeight = windowHeight * 0.5;
  createCanvas(canvasWidth, canvasHeight);
  drawSliders();

  for (let i = 0; i < 30; i++) {
    fishArray.push(new PreyFish());

    if (i % 5 === 0) {
        fishArray.push(new PredatorFish());
    }
  }
}

function draw() {
  background(15, 8, 50);

  for (let i = 0; i < sliders.length; i++) {
    let sliderObj = sliders[i];
    push();
    fill(255);
    textSize(windowWidth * 0.01);
    textAlign(LEFT, CENTER);
    text(sliderObj.label, sliderObj.slider.x + sliderObj.slider.width, sliderObj.slider.y + sliderObj.slider.height / 2);
    pop();
  }

  manageSliders();

  for (let i = 0; i < fishArray.length; i++) {
    let fish = fishArray[i];
    fish.appear();
    fish.update();

    if (fish instanceof PreyFish) {
      fish.flock(fishArray);
    }

    else if (fish instanceof PredatorFish) {
        fish.chase(fishArray);
    }
  }
}
