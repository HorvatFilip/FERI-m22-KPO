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
        this.infoCtx.font = "10px Arial";
        this.infoPoints = {};
        this.timeStamp = 0;
        this.chartOffset = 20;
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
    updateData(state) {
        this.updateChartPoints(state.organismGroups);
    }
    syncSimData(state) {
        this.clearSimCanvas();
        this.drawAllOrganisms(state.organismGroups);
    }
    syncInfoData(state) {
        this.clearChartCanvas();
        this.drawChart(state.timePassed);
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
                if (this.infoPoints[orgGroup.type]["popSize"].length > this.infoCanvas.width - this.chartOffset) {
                    this.infoPoints[orgGroup.type]["popSize"].shift();
                }
            }
        });
    }
    drawChart() {
        this.infoCtx.strokeStyle = "black";
        this.infoCtx.beginPath();
        this.infoCtx.moveTo(this.chartOffset, this.infoCanvas.height - this.chartOffset);
        this.infoCtx.lineTo(this.chartOffset, 0);

        this.infoCtx.moveTo(this.chartOffset, this.infoCanvas.height - this.chartOffset);
        this.infoCtx.lineTo(this.infoCanvas.width, this.infoCanvas.height - this.chartOffset);
        this.infoCtx.stroke();

        let organismTypes = Object.keys(this.infoPoints);
        organismTypes.forEach(orgType => {
            this.infoCtx.strokeStyle = this.infoPoints[orgType]["orgColor"];
            let timeInterval = 0;
            this.infoCtx.beginPath();
            for (let i = 0; i < this.infoPoints[orgType]["popSize"].length - 1; i++) {
                this.infoCtx.moveTo(timeInterval + this.chartOffset, this.infoCanvas.height - this.chartOffset - this.infoPoints[orgType]["popSize"][i]);
                timeInterval += 24;
                this.infoCtx.lineTo(timeInterval + this.chartOffset, this.infoCanvas.height - this.chartOffset - this.infoPoints[orgType]["popSize"][i + 1]);
            }
            this.infoCtx.stroke();
        });
    }
}