class Vector {
    #x
    #y
    #x_comp
    #y_comp
    #thickness
    #color
    #name
    #arrowSize
    
    constructor(x_pos, y_pos, x_comp, y_comp, thickness = 3, color = 'black', name = 'unnamed', arrowSize = 10) {
        this.#x = x_pos;
        this.#y = y_pos;
        this.#x_comp = x_comp;
        this.#y_comp = y_comp;
        this.#thickness = thickness;
        this.#color = color;
        this.#name = name;
        this.#arrowSize = arrowSize;
    }

    getVector(attribute) {
        if (attribute === 'length') {
            return Math.sqrt(this.#x_comp ** 2 + this.#y_comp ** 2);
        }
        switch (attribute) {
            case 'x': 
                return this.#x;
            case 'y': 
                return this.#y;
            case 'x_comp': 
                return this.#x_comp;
            case 'y_comp': 
                return this.#y_comp;
            case 'thickness': 
                return this.#thickness;
            case 'color':  
                return this.#color;
            case 'name':   
                return this.#name;
            case 'arrowSize': 
                return this.#arrowSize;
            default: return null;
        }
    }
    
    setVector(attribute, value) {
        switch (attribute) {
            case 'x': 
                this.#x = value; break;
            case 'y': 
                this.#y = value; break;
            case 'x_comp': 
                this.#x_comp = value; break;
            case 'y_comp': 
                this.#y_comp = value; break;
            case 'thickness': 
                this.#thickness = value; break;
            case 'color': 
                this.#color = value; break;
            case 'name': 
                this.#name = value; break;
            case 'arrowSize': 
                this.#arrowSize = value; break;
            default: return null;
        }
        console.log(`Updated ${this.#name}'s ${attribute} to`, value);
        return value;
    }

    add(inputVector) {
        let addedXComp = inputVector.getVector('x_comp') + this.getVector('x_comp');
        let addedYComp = inputVector.getVector('y_comp') + this.getVector('y_comp');
        let addedVector = new Vector(
            this.getVector('x'), this.getVector('y'),
            addedXComp, addedYComp
        );
        return addedVector;
    }    

    subtract(inputVector) {
        let subXComp = inputVector.getVector('x_comp') - this.getVector('x_comp');
        let subYComp = inputVector.getVector('y_comp') - this.getVector('y_comp');
        let subVector = new Vector(
            this.getVector('x'), this.getVector('y'),
            subXComp, subYComp
        );
        return subVector;
    }

    scalar(k) {
        let scaledXComp = this.getVector('x_comp') * k;
        let scaledYComp = this.getVector('y_comp') * k;
        let scaledVector = new Vector(
            this.getVector('x'), this.getVector('y'),
            scaledXComp, scaledYComp
        );
        return scaledVector;
    }

    negate() {
        this.scalar(-1);
    }

    dotProduct(inputVector) {
        let dotX = inputVector.getVector('x_comp') * this.getVector('x_comp');
        let dotY = inputVector.getVector('y_comp') * this.getVector('y_comp');
        return dotX + dotY;
    }  

    show() {
        stroke(this.#color);
        strokeWeight(this.#thickness);
        fill(this.#color);

        line(this.#x, this.#y, this.#x + this.#x_comp, this.#y + this.#y_comp);

        let angle = atan2(this.#y_comp, this.#x_comp);
        let endX = this.#x + this.#x_comp;
        let endY = this.#y + this.#y_comp;

        push();
        translate(endX, endY);
        rotate(angle);
        let size = this.#arrowSize;
        triangle(0, 0, -size, size / 2, -size, -size / 2);
        pop();
    }
}

let vector1;
let vector2;
let vector3;
let vector4;
let vector5;

function setup() {
    let canvasWidth = 400;
    let canvasHeight = 400;
    createCanvas(canvasWidth, canvasHeight);

    vector1 = new Vector(
        canvasWidth / 2, canvasHeight / 2,
        random(-100, 100), random(-100, 100),
        4, 'blue', 'vector1'
    );

    vector2 = new Vector(
        canvasWidth / 2, canvasHeight / 2,
        random(-100, 100), random(-100, 100),
        4, 'green', ''
    );

    vector3 = vector1.add(vector2);
    vector4 = vector1.subtract(vector2);
    vector5 = vector1.scalar(2);
    vector1.setVector('color', 'red');
    vector3.setVector('color', 'blue');
    vector4.setVector('color', 'purple');
}

function draw() {
    background(200);
    vector1.show();
    vector2.show();
    vector3.show();
    vector4.show();
    vector5.show();

}

/* Øvelse i timen
class A {
    constructor() {
        this.b = null; 
    }

    setB() {
        this.b = new B(); 
    }
}

class B {
    constructor() {
        this.a = null; 
    }

    setA() {
        this.a = new A(); 
    }
}

let instanceA = new A();
let instanceB = new B();

instanceA.setB();
instanceB.setA();

console.log(instanceA);
console.log(instanceB);
*/ 

