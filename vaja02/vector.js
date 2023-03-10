class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vector02) {
        return new Vector(this.x + vector02.x, this.y + vector02.y);
    }
    subtract(vector02) {
        return new Vector(this.x - vector02.x, this.y - vector02.y);
    }
    addScalar(scalar) {
        return new Vector(this.x + scalar, this.y + scalar);
    }
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }
    dotProduct(vector02) {
        return this.x * vector02.x + this.y * vector02.y;
    }
    getMagnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    getDirection() {
        return Math.atan2(this.x, this.y);
    }
    equals(vector02) {
        if (this.x == vector02.x && this.y == vector02.y) {
            return true;
        } else {
            return false;
        }
    }
}