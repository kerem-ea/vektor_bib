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
    const minSpeed = 1;
    const maxSpeed = isPredator ? 1.5 : 3;
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
    let pos = this.getPosition();
    let s = this.getSize();
    let angle = atan2(
      this.getVelocity().getVector('y_comp'),
      this.getVelocity().getVector('x_comp')
    );

    push();
    translate(pos.getVector('x'), pos.getVector('y'));
    rotate(angle);
    let wiggle = sin(frameCount * 0.3) * 0.1;
    scale(1 + wiggle, 1);

    fill(this.#color);
    noStroke();
    ellipse(0, 0, s * 2.2, s);

    let tailWag = sin(frameCount * 0.3) * 5;
    fill(this.#color);
    triangle(-s, 0, -s - 8, tailWag, -s - 8, -tailWag);
    pop();
  }

  canSee(otherFish, viewDistance = 100) {
    if (otherFish === this) return false;

    let myPos = this.getPosition();
    let otherPos = otherFish.getPosition();

    let dx = otherPos.getVector('x') - myPos.getVector('x');
    let dy = otherPos.getVector('y') - myPos.getVector('y');

    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > viewDistance) return false;

    let myVel = this.getVelocity();
    let directionToOther = new Vector(myPos.getVector('x'), myPos.getVector('y'), dx, dy);

    let dot = myVel.dotProduct(directionToOther);

    return dot > -0.3; 
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
      if (fish instanceof PreyFish && this.canSee(fish, chaseRadius)) {
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
    let pos = this.getPosition();
    let s = this.getSize() * 1.6; 
    let angle = atan2(
      this.getVelocity().getVector('y_comp'),
      this.getVelocity().getVector('x_comp')
    );

    push();
    translate(pos.getVector('x'), pos.getVector('y'));
    rotate(angle);

    let bodyWiggle = sin(frameCount * 0.2) * 0.15;
    scale(1 + bodyWiggle, 1);

    fill(this.#PredatorColor);
    noStroke();
    ellipse(0, 0, s * 2.4, s * 0.9);

    let tailSway = sin(frameCount * 0.2) * 7;
    fill(this.#PredatorColor);
    triangle(-s, 0, -s - 12, tailSway, -s - 12, -tailSway);
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

    for (let otherFish of fishArray) {
      if (otherFish !== this && this.canSee(otherFish, cohesionConstant)) {
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
    for (let otherFish of fishArray) {
      if (otherFish !== this && this.canSee(otherFish, alignmentConstant)) {
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

    for (let otherFish of fishArray) {
      if (otherFish !== this && this.canSee(otherFish, separationConstant)) {
        let dx = this.getPosition().getVector('x') - otherFish.getPosition().getVector('x');
        let dy = this.getPosition().getVector('y') - otherFish.getPosition().getVector('y');
        let diff = new Vector(this.getPosition().getVector('x'), this.getPosition().getVector('y'), dx, dy);

        let forceMultiplier = otherFish instanceof PredatorFish ? 10 : 1;
        steer = steer.add(diff.scalar(forceMultiplier / dist(this.getPosition().getVector('x'), this.getPosition().getVector('y'), otherFish.getPosition().getVector('x'), otherFish.getPosition().getVector('y'))));
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