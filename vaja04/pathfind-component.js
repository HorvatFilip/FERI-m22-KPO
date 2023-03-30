class Node {
    constructor(x, y) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.g = 0;
        this.h = 0;
        this.f = 0;
    }
    calcCost(currentNode, goalNode) {
        this.g = currentNode.g + euclidDistance(this, currentNode);
        this.h = euclidDistance(this, goalNode);
        this.f = this.g + this.h;
    }
    equals(node2) {
        if (this.x == node2.x && this.y == node2.y) {
            return true;
        } else {
            return false;
        }
    }
}
class PathFindingAlg {
    constructor(currPos, goalPos) {
        this.currentNode = new Node(currPos.x / 17, currPos.y / 17);
        this.goalNode = new Node(goalPos.x / 17, goalPos.y / 17);
        this.openList = [this.currentNode];
        this.closedList = [];
        this.neighbors = [];
    }
    findPathToGoal() {
        let bufferNode = null;
        let isClosed = null;
        let isOpened = null;
        let mapTile = null;
        let x = null;
        let y = null;
        let mapIndx = null;
        let step = 0;
        let maxSteps = 1000;
        while (this.openList.length != 0 && step < maxSteps) {
            step++;
            this.getLowestCostNode();

            this.closedList.push(this.currentNode);
            if (this.currentNode.equals(this.goalNode)) {
                return this.closedList;
            }
            for (let i = -1; i < 2; i++) {
                if (this.currentNode.x + i < 0 || this.currentNode.x + i > SIM_MAP.data.width - 1) {
                    continue;
                }
                for (let j = -1; j < 2; j++) {
                    if (this.currentNode.y + j < 0 || this.currentNode.y + j > SIM_MAP.data.length - 1) {
                        continue;
                    } else {
                        mapIndx = SIM_MAP.data.width * (this.currentNode.y + j) + (this.currentNode.x + i);
                        mapTile = SIM_MAP.data.data[mapIndx];
                        //mapTile = grid[this.currentNode.x + i][this.currentNode.y + j];
                        if (mapTile < 0.8 && mapTile > 0.4) {
                            bufferNode = new Node(this.currentNode.x + i, this.currentNode.y + j);
                            bufferNode.calcCost(this.currentNode, this.goalNode);
                            this.neighbors.push(bufferNode);
                        }
                    }
                }
            }
            for (let i = 0; i < this.neighbors.length; i++) {
                isClosed = false;
                for (let j = 0; j < this.closedList.length; j++) {
                    if (this.neighbors[i].equals(this.closedList[j])) {
                        isClosed = true;
                        break;
                    }
                }
                if (!isClosed) {
                    this.neighbors[i].calcCost(this.currentNode, this.goalNode);
                    isOpened = false;
                    for (let j = 0; j < this.openList.length; j++) {
                        if (this.neighbors[i].equals(this.openList[j]) && this.neighbors[i].g > this.openList[j]) {
                            isOpened = true;
                            break;
                        }
                    }
                    if (!isOpened) {
                        this.openList.push(this.neighbors[i]);
                    }
                }
            }
        }
        return this.closedList;
    }
    getLowestCostNode() {
        this.currentNode = this.openList[0];
        let indx = 0;
        for (let i = 1; i < this.openList.length; i++) {
            if (this.openList[i].f < this.currentNode.f) {
                this.currentNode = this.openList[i];
                indx = i;
            }
        }
        this.openList.splice(indx, 1);
    }
}
