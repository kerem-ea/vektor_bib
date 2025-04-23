class Fish {
    #pos; #vel; #size; #color; #acc;

    constructor() {
        this.#pos = new Vector(canvasWidth/2, canvasWidth/2, random(-canvasWidth/100, canvasWidth/100), random(-canvasWidth/100, canvasWidth/100));
        this.#vel = new Vector(0, 0, random(-canvasWidth/300, canvasWidth/300), random(-canvasWidth/300, canvasWidth/300));
        this.#size = canvasWidth/100;
        this.#color = getRandomColor();
        this.#acc = null;
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

    update() {
        this.#pos.setVector('x', this.#pos.getVector('x') + this.#vel.getVector('x_comp'));
        this.#pos.setVector('y', this.#pos.getVector('y') + this.#vel.getVector('y_comp'));
        this.boundaryCheck();
        this.flock(fishArray);
        this.limitSpeed();  
    }

    limitSpeed() {
        let speed = this.#vel.getVector('length');
        let maxSpeed = 4; 
        let minSpeed = 3;
    
        if (speed > maxSpeed) {
            let scale = maxSpeed / speed; 
            this.#vel = this.#vel.scalar(scale); 
        } 
        
        else if (speed < minSpeed) {
            let scale = minSpeed / speed;  
            this.#vel = this.#vel.scalar(scale); 
        }
    }
    

    boundaryCheck() {
        let marginX = canvasWidth / 16;  
        let marginY = canvasHeight / 16; 
    
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
        triangle(
            -this.#size, 0, 
            -this.#size - tailWidth, -tailHeight / 2, 
            -this.#size - tailWidth, tailHeight / 2  
        );
        pop();
        
        /*
        if (this === typeof PredatorFish) {
            fill(255, 0, 0); // Virker ikke
        }
        */
    }

    cohesion(fishArray) {
        let centerOfMass = new Vector(0, 0, 0, 0);
        let total = 0;
    
        for (let i = 0; i < fishArray.length; i++) {
            let otherFish = fishArray[i];
            let distance = dist(this.#pos.getVector('x'), this.#pos.getVector('y'), otherFish.#pos.getVector('x'), otherFish.#pos.getVector('y'));
            if (distance > 0 && distance < cohesionConstant) {
                centerOfMass.setVector('x', centerOfMass.getVector('x') + otherFish.#pos.getVector('x'));
                centerOfMass.setVector('y', centerOfMass.getVector('y') + otherFish.#pos.getVector('y'));
                total++;
            }
        }
    
        if (total > 0) {
            centerOfMass.setVector('x', centerOfMass.getVector('x') / total);
            centerOfMass.setVector('y', centerOfMass.getVector('y') / total);
            let direction = new Vector(this.#pos.getVector('x'), this.#pos.getVector('y'), centerOfMass.getVector('x') - this.#pos.getVector('x'), centerOfMass.getVector('y') - this.#pos.getVector('y'));
            this.#vel = this.#vel.add(direction.scalar(0.005)); 
        }
    }
    
    alignment(fishArray) {
        let avgVel = new Vector(0, 0, 0, 0);
        let total = 0;
    
        for (let i = 0; i < fishArray.length; i++) {
            let otherFish = fishArray[i];
            let distance = dist(this.#pos.getVector('x'), this.#pos.getVector('y'), otherFish.#pos.getVector('x'), otherFish.#pos.getVector('y'));
            if (distance > 0 && distance < alignmentConstant) {
                avgVel.setVector('x_comp', avgVel.getVector('x_comp') + otherFish.#vel.getVector('x_comp'));
                avgVel.setVector('y_comp', avgVel.getVector('y_comp') + otherFish.#vel.getVector('y_comp'));
                total++;
            }
        }
    
        if (total > 0) {
            avgVel.setVector('x_comp', avgVel.getVector('x_comp') / total);
            avgVel.setVector('y_comp', avgVel.getVector('y_comp') / total);
    
            let direction = new Vector(this.#pos.getVector('x'), this.#pos.getVector('y'), avgVel.getVector('x_comp') - this.#vel.getVector('x_comp'), avgVel.getVector('y_comp') - this.#vel.getVector('y_comp'));
            this.#vel = this.#vel.add(direction.scalar(0.005)); 
        }
    }
    
    separation(fishArray) {
        let steer = new Vector(0, 0, 0, 0);
        let total = 0;
    
        for (let i = 0; i < fishArray.length; i++) {
            let otherFish = fishArray[i];
            let distance = dist(this.#pos.getVector('x'), this.#pos.getVector('y'), otherFish.#pos.getVector('x'), otherFish.#pos.getVector('y'));
    
            if (distance > 0 && distance < separationConstant) {
                let diff = new Vector(this.#pos.getVector('x'), this.#pos.getVector('y'), this.#pos.getVector('x') - otherFish.#pos.getVector('x'), this.#pos.getVector('y') - otherFish.#pos.getVector('y'));
                steer = steer.add(diff.scalar(1 / distance)); 
                total++;
            }
        }
    
        if (total > 0) {
            steer = steer.scalar(1 / total);
        }
    
        this.#vel = this.#vel.add(steer.scalar(0.1)); 
    }

    flock(fishArray) {
        this.cohesion(fishArray);
        this.alignment(fishArray);
        this.separation(fishArray);
    }
}

/*
class PredatorFish extends Fish {
    #aggro;

    constructor() {
        super();
        this.#aggro = random(1, 10);
    }

    chase(fishArray) {
        let closestPrey = null;
        let minDistance = Infinity;

        for (let i = 0; i < fishArray.length; i++) {
            let otherFish = fishArray[i];
            if (otherFish instanceof PreyFish) {
                let distance = dist(this.getPosition().getVector('x'), this.getPosition().getVector('y'),
                    otherFish.getPosition().getVector('x'), otherFish.getPosition().getVector('y'));
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPrey = otherFish;
                }
            }
        }

        if (closestPrey) {
            let direction = new Vector(this.getPosition().getVector('x'), this.getPosition().getVector('y'),
                closestPrey.getPosition().getVector('x') - this.getPosition().getVector('x'),
                closestPrey.getPosition().getVector('y') - this.getPosition().getVector('y'));

            this.getVelocity().add(direction.scalar(0.1 * this.#aggro));
        }
    }

    flock(fishArray) {
        this.chase(fishArray);
    }
}


class PreyFish extends Fish {}

*/

