class Vector {
    constructor(x_pos, y_pos, x_comp, y_comp, thickness = 3, color = 'black', name = '', arrowSize = 10) {
        this.x = x_pos;       
        this.y = y_pos;       
        this.x_comp = x_comp;  
        this.y_comp = y_comp;  
        this.thickness = thickness;  
        this.color = color;
        this.name = name;
        this.arrowSize = arrowSize; 
    }

    getVector(attribute) {
        let vector_info = [
            'x',
            'y',
            'x_comp',
            'y_comp',
            'thickness',
            'color',
            'name',
            'arrowSize'
        ];

       
        for (let i = 0; i < vector_info.length; i++) {
            let current = vector_info[i];
            if (current == attribute) {
                console.log(this[current]);
            }
        }
    }

    getLength() {
        return Math.sqrt(this.x_comp ** 2 + this.y_comp ** 2);
    }

    show() {
        stroke(this.color);     
        strokeWeight(this.thickness); 
        fill(this.color);        
       
        line(this.x, this.y, this.x + this.x_comp, this.y + this.y_comp);
        
        let angle = atan2(this.y_comp, this.x_comp); 
        let endX = this.x + this.x_comp;
        let endY = this.y + this.y_comp;

        push();
        translate(endX, endY); 
        rotate(angle); 
        let size = this.arrowSize; 
        triangle(0, 0, -size, size / 2, -size, -size / 2);
        pop();
    }
}

function setup() {
    let canvasWidth = 400;
    let canvasHeight = 400;
    createCanvas(canvasWidth, canvasHeight);
    background(200);

    let vector = new Vector(
       	canvasWidth/2, canvasHeight/2, 
        random(-100, 100), random(-100, 100), 
        4, 'blue', '', 15
    ); 

    vector.show();

    vector.getVector('x'); 
    vector.getVector('color');
}

function draw() {
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

