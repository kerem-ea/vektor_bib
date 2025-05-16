class Fish {
  #pos; #vel; #size; #color;

  constructor() {
    this.#pos = new Vector(canvasWidth/2, canvasWidth/2, random(-canvasWidth/100, canvasWidth/100), random(-canvasWidth/100, canvasWidth/100));
    this.#vel = new Vector(0, 0, random(-canvasWidth/300, canvasWidth/300), random(-canvasWidth/300, canvasWidth/300));
    this.#size = canvasWidth/100;
    this.#color = getRandomColor("Prey");
  }

  getPosition() {
    return this.#pos;
  }

  getVelocity() {
    return this.#vel;
  }

  getRadius() {
    return this.#size;
  }

  getColor() {
    return this.#color;
  }

  setVelocity(newVel) {
    this.#vel = newVel;
  }

  setColor(newColor) {
    this.#color = newColor;
  }

  getSize() {
    return this.#size;
  }

  update() {
    this.#pos.setVector('x', this.#pos.getVector('x') + this.#vel.getVector('x_comp'));
    this.#pos.setVector('y', this.#pos.getVector('y') + this.#vel.getVector('y_comp'));
    this.boundaryCheck();
    this.limitSpeed();
  }

  limitSpeed() {
    const speed = this.#vel.getVector('length');
    const isPredator = this instanceof PredatorFish;
    const minSpeed = 2;
    const maxSpeed = isPredator ? 2 : 6;
    if (speed > maxSpeed || speed < minSpeed) {
      const target = speed > maxSpeed ? maxSpeed : minSpeed;
      this.#vel = this.#vel.scalar(target / speed);
    }
  }

  boundaryCheck() {
    const marginX = canvasWidth / 16;
    const marginY = canvasHeight / 16;
    if (this.#pos.getVector('x') - this.#size < marginX || this.#pos.getVector('x') + this.#size > canvasWidth - marginX) {
      this.#vel.setVector('x_comp', -this.#vel.getVector('x_comp'));
      this.#pos.setVector('x', constrain(this.#pos.getVector('x'), this.#size + marginX, canvasWidth - this.#size - marginX));
    }
    if (this.#pos.getVector('y') - this.#size < marginY || this.#pos.getVector('y') + this.#size > canvasHeight - marginY) {
      this.#vel.setVector('y_comp', -this.#vel.getVector('y_comp'));
      this.#pos.setVector('y', constrain(this.#pos.getVector('y'), this.#size + marginY, canvasHeight - this.#size - marginY));
    }
  }
  
  appear() {
    fill(this.#color);
    let angle = atan2(this.#vel.getVector('y_comp'), this.#vel.getVector('x_comp'));
    push();
    translate(this.#pos.getVector('x'), this.#pos.getVector('y'));
    rotate(angle);
    ellipse(0, 0, this.#size * 2, this.#size);
    let tailWidth = this.#size * 1.5;
    let tailHeight = this.#size;
    triangle(-this.#size, 0, -this.#size - tailWidth, -tailHeight / 2, -this.#size - tailWidth, tailHeight / 2);
    pop();
  }
}

class PredatorFish extends Fish {
  #aggro; #PredatorColor;
  
  constructor() {
    super();
    this.#aggro = random(0.5, 2);
    this.#PredatorColor = getRandomColor("Pred");
  }

  chase(fishArray) {
    const chaseRadius = 150;
    let predatorPos = this.getPosition();
  
    let nearestPrey = null;
    let shortestDist = Infinity;
  
    for (let fish of fishArray) {
      if (fish instanceof PreyFish) {
        let preyPos = fish.getPosition();
        let d = dist(
          predatorPos.getVector('x'), predatorPos.getVector('y'),
          preyPos.getVector('x'), preyPos.getVector('y')
        );
  
        if (d < chaseRadius && d < shortestDist) {
          shortestDist = d;
          nearestPrey = fish;
        }
      }
    }
  
    if (nearestPrey) {
      let preyPos = nearestPrey.getPosition();
      let dx = preyPos.getVector('x') - predatorPos.getVector('x');
      let dy = preyPos.getVector('y') - predatorPos.getVector('y');
      let chaseVec = new Vector(
        predatorPos.getVector('x'),
        predatorPos.getVector('y'),
        dx,
        dy
      );
      this.setVelocity(this.getVelocity().add(chaseVec.scalar(0.02 * this.#aggro)));
    }
  }  

  appear() {
    fill(this.#PredatorColor);
    let angle = atan2(this.getVelocity().getVector('y_comp'), this.getVelocity().getVector('x_comp'));
    push();
    translate(this.getPosition().getVector('x'), this.getPosition().getVector('y'));
    rotate(angle);
    ellipse(0, 0, this.getSize() * 3, this.getSize());
    let tailWidth = this.getSize() * 2;
    let tailHeight = this.getSize() * 1.5;
    triangle(-this.getSize(), 0, -this.getSize() - tailWidth, -tailHeight / 2, -this.getSize() - tailWidth, tailHeight / 2);
    pop();
  }
}

class PreyFish extends Fish {
  constructor() {
    super();
  }
  cohesion(fishArray) {
    let centerOfMass = new Vector(0, 0, 0, 0);
    let total = 0;
    
    for (let i = 0; i < fishArray.length; i++) {
      let otherFish = fishArray[i];
      let distance = dist(this.getPosition().getVector('x'), this.getPosition().getVector('y'), otherFish.getPosition().getVector('x'), otherFish.getPosition().getVector('y'));
      if (distance > 0 && distance < cohesionConstant) {
        centerOfMass.setVector('x', centerOfMass.getVector('x') + otherFish.getPosition().getVector('x'));
        centerOfMass.setVector('y', centerOfMass.getVector('y') + otherFish.getPosition().getVector('y'));
        total++;
      }
    }

    if (total > 0) {
      centerOfMass.setVector('x', centerOfMass.getVector('x') / total);
      centerOfMass.setVector('y', centerOfMass.getVector('y') / total);
      let direction = new Vector(this.getPosition().getVector('x'), this.getPosition().getVector('y'), centerOfMass.getVector('x') - this.getPosition().getVector('x'), centerOfMass.getVector('y') - this.getPosition().getVector('y'));
      const newV = this.getVelocity().add(direction.scalar(0.005));
      this.setVelocity(newV);
    }
  }

  alignment(fishArray) {
    let avgVel = new Vector(0, 0, 0, 0);
    let total = 0;
    for (let i = 0; i < fishArray.length; i++) {
      let otherFish = fishArray[i];
      let distance = dist(this.getPosition().getVector('x'), this.getPosition().getVector('y'), otherFish.getPosition().getVector('x'), otherFish.getPosition().getVector('y'));
      if (distance > 0 && distance < alignmentConstant) {
        avgVel.setVector('x_comp', avgVel.getVector('x_comp') + otherFish.getVelocity().getVector('x_comp'));
        avgVel.setVector('y_comp', avgVel.getVector('y_comp') + otherFish.getVelocity().getVector('y_comp'));
        total++;
      }
    }

    if (total > 0) {
      avgVel.setVector('x_comp', avgVel.getVector('x_comp') / total);
      avgVel.setVector('y_comp', avgVel.getVector('y_comp') / total);
      let direction = new Vector(this.getPosition().getVector('x'), this.getPosition().getVector('y'), avgVel.getVector('x_comp') - this.getVelocity().getVector('x_comp'), avgVel.getVector('y_comp') - this.getVelocity().getVector('y_comp'));
      const newV = this.getVelocity().add(direction.scalar(0.005));
      this.setVelocity(newV);
    }
  }

  separation(fishArray) {
    let steer = new Vector(0, 0, 0, 0);
    let total = 0;
  
    for (let i = 0; i < fishArray.length; i++) {
      let otherFish = fishArray[i];
      let distance = dist(
        this.getPosition().getVector('x'),
        this.getPosition().getVector('y'),
        otherFish.getPosition().getVector('x'),
        otherFish.getPosition().getVector('y')
      );
  
      if (distance > 0 && distance < separationConstant) {
        let dx = this.getPosition().getVector('x') - otherFish.getPosition().getVector('x');
        let dy = this.getPosition().getVector('y') - otherFish.getPosition().getVector('y');
        let diff = new Vector(this.getPosition().getVector('x'), this.getPosition().getVector('y'), dx, dy);
  
        let forceMultiplier = otherFish instanceof PredatorFish ? 10 : 1;
        steer = steer.add(diff.scalar((forceMultiplier) / distance));
        total++;
      }
    }
  
    if (total > 0) {
      steer = steer.scalar(1 / total);
      const newV = this.getVelocity().add(steer.scalar(0.1));
      this.setVelocity(newV);
    }
  }
  
  flock(fishArray) {
    this.cohesion(fishArray);
    this.alignment(fishArray);
    this.separation(fishArray);
  }
}