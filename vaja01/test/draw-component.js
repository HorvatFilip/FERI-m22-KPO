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
                this.infoPoints[orgGroup.type] = {
                    orgColor: orgGroup.orgColor,
                    popSize: [orgGroup.popSize]
                };
            } else {
                if (this.infoPoints[orgGroup.type]["orgColor"] != orgGroup.orgColor) {
                    this.infoPoints[orgGroup.type]["orgColor"] = orgGroup.orgColor;
                }
                this.infoPoints[orgGroup.type]["popSize"].push(orgGroup.popSize);
                if (this.infoPoints[orgGroup.type]["popSize"].length > this.infoCanvas.width) {
                    this.infoPoints[orgGroup.type]["popSize"].shift();
                }
            }
        });
    }
    drawChart() {
        let organismTypes = Object.keys(this.infoPoints);
        organismTypes.forEach(orgType => {
            this.infoCtx.strokeStyle = this.infoPoints[orgType]["orgColor"];

            let timeInterval = 0;
            this.infoCtx.beginPath();
            for (let i = 0; i < this.infoPoints[orgType]["popSize"].length - 1; i++) {
                this.infoCtx.moveTo(timeInterval, this.infoCanvas.height - this.infoPoints[orgType]["popSize"][i]);
                timeInterval += 1;
                this.infoCtx.lineTo(timeInterval, this.infoCanvas.height - this.infoPoints[orgType]["popSize"][i + 1]);
            }
            this.infoCtx.stroke();
        });
    }
}