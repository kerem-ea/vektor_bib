class Fish {
    #pos; #vel; #radius; #color;

    constructor() {
        this.#pos = new Vector(canvasWidth/2, canvasWidth/2, random(-canvasWidth/100, canvasWidth/100), random(-canvasWidth/100, canvasWidth/100));
        this.#vel = new Vector(0, 0, random(-canvasWidth/200, canvasWidth/200), random(-canvasWidth/200, canvasWidth/200));
        this.#radius = canvasWidth/20;
        this.#color = getRandomColor();
    }

    update() {
        this.#pos.setVector('x', this.#pos.getVector('x') + this.#vel.getVector('x_comp'));
        this.#pos.setVector('y', this.#pos.getVector('y') + this.#vel.getVector('y_comp'));
        this.boundaryCheck();
    }

    boundaryCheck() {
        if (this.#pos.getVector('x') - this.#radius < 0 || this.#pos.getVector('x') + this.#radius > canvasWidth) {
            this.#vel.setVector('x_comp', -this.#vel.getVector('x_comp')); 
            this.#pos.setVector('x', constrain(this.#pos.getVector('x'), this.#radius, canvasWidth - this.#radius));
        }
    
        if (this.#pos.getVector('y') - this.#radius < 0 || this.#pos.getVector('y') + this.#radius > canvasHeight) {
            this.#vel.setVector('y_comp', -this.#vel.getVector('y_comp')); 
            this.#pos.setVector('y', constrain(this.#pos.getVector('y'), this.#radius, canvasHeight - this.#radius));
        }
    }    
    

    appear() {
        fill(this.#color);
        circle(this.#pos.getVector('x'), this.#pos.getVector('y'), this.#radius * 2);
    }
    
}

class PredatorFish extends Fish {}
class PreyFish extends Fish {}



