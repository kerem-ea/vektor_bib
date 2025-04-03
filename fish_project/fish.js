class Fish {
    #pos; #vel; #radius;

    constructor() {
        this.#pos = new Vector(200, 200, random(-2, 2), random(-2, 2));
        this.#vel = new Vector(0, 0, random(-2, 2), random(-2, 2));
        this.#radius = 60;
    }

    update() {
        this.#pos = this.#pos.add(this.#vel);
        this.boundaryCheck();
    }

    boundaryCheck() {
        if (this.#pos.getVector('x') - this.#radius < 0 || this.#pos.getVector('x') + this.#radius > width) {
            this.#vel.setVector('x_comp', -this.#vel.getVector('x_comp'));
        }
        if (this.#pos.getVector('y') - this.#radius < 0 || this.#pos.getVector('y') + this.#radius > height) {
            this.#vel.setVector('y_comp', -this.#vel.getVector('y_comp'));
        }
    }

    appear() {
        fill(255, 0, 0);
        circle(this.#pos.getVector('x'), this.#pos.getVector('y'), this.#radius);
    }
    
}

class PredatorFish extends Fish {}
class PreyFish extends Fish {}



