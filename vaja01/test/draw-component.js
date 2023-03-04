class DrawComponent {
    constructor(simCanvasConf, infoCanvasConf) {
        this.simCanvas = document.getElementById(simCanvasConf.id);
        this.simCanvas.width = simCanvasConf.width;
        this.simCanvas.height = simCanvasConf.height;
        this.simCtx = this.simCanvas.getContext("2d");

        this.infoCanvas = document.getElementById(infoCanvasConf.id);
        this.infoCanvas.width = infoCanvasConf.width;
        this.infoCanvas.height = infoCanvasConf.height;
        this.infoCtx = this.infoCanvas.getContext("2d");
        this.infoPoints = {};
    }
    drawBoard() {
        console.log("TODO - drawBoard");
    }
    clearSimCanvas() {
        this.simCtx.fillStyle = "rgb(50, 60, 70)";
        this.simCtx.fillRect(0, 0, this.simCanvas.width, this.simCanvas.height);
    }
    clearChartCanvas() {
        this.infoCtx.fillStyle = "rgb(50, 60, 70)";
        this.infoCtx.fillRect(0, 0, this.infoCanvas.width, this.infoCanvas.height);
    }

    sync(state) {
        this.clearSimCanvas();
        this.drawAllOrganisms(state.organismGroups);
        this.updateChartPoints(state.organismGroups);
        if (Math.floor(state.timePassed) % 1 == 0) {
            this.clearChartCanvas();
            this.drawChart();
        }
    }
    drawAllOrganisms(organismGroups) {
        organismGroups.forEach(orgGroup => {
            orgGroup.population.forEach(org => {
                this.drawOrganism(org)
            })
        });
    }
    drawOrganism(organism) {
        this.simCtx.beginPath();
        this.simCtx.arc(organism.pos.x, organism.pos.y, organism.size, 0, Math.PI * 2);
        this.simCtx.closePath();
        this.simCtx.fillStyle = organism.color;
        this.simCtx.fill();
    }
    updateChartPoints(organismGroups) {
        organismGroups.forEach(orgGroup => {
            if (this.infoPoints[orgGroup.type] === undefined) {
                this.infoPoints[orgGroup.type] = [orgGroup.popSize];
            } else {
                this.infoPoints[orgGroup.type].push(orgGroup.popSize);
                if (this.infoPoints[orgGroup.type].length > this.infoCanvas.width) {
                    this.infoPoints[orgGroup.type].shift();
                }
            }
        });
    }
    drawChart() {
        let organismTypes = Object.keys(this.infoPoints);
        organismTypes.forEach(orgType => {
            if (orgType == "insect") {
                this.infoCtx.strokeStyle = "green";
            } else if (orgType == "bird") {
                this.infoCtx.strokeStyle = "blue";
            } else if (orgType == "cat") {
                this.infoCtx.strokeStyle = "black";
            }

            let timeInterval = 0;
            this.infoCtx.beginPath();
            for (let i = 0; i < this.infoPoints[orgType].length - 1; i++) {
                this.infoCtx.moveTo(timeInterval, this.infoCanvas.height - this.infoPoints[orgType][i]);
                timeInterval += 1;
                this.infoCtx.lineTo(timeInterval, this.infoCanvas.height - this.infoPoints[orgType][i + 1]);
            }
            this.infoCtx.stroke();
        });
    }
}