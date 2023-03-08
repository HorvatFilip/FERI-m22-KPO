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
        this.simCtx.arc(organism.pos.x, organism.pos.y, organism.orgSize, 0, Math.PI * 2);
        this.simCtx.closePath();
        this.simCtx.fillStyle = organism.orgColor;
        this.simCtx.fill();
    }
    updateChartPoints(organismGroups) {
        organismGroups.forEach(orgGroup => {
            if (this.infoPoints[orgGroup.id] === undefined) {
                this.infoPoints[orgGroup.id] = {
                    orgColor: orgGroup.conf.orgColor,
                    popSize: [orgGroup.popSize]
                };
            } else {
                if (this.infoPoints[orgGroup.id].orgColor != orgGroup.conf.orgColor) {
                    this.infoPoints[orgGroup.id].orgColor = orgGroup.conf.orgColor;
                }
                this.infoPoints[orgGroup.type].popSize.push(orgGroup.popSize);
                if (this.infoPoints[orgGroup.id].popSize.length > this.infoCanvas.width - this.chartOffset) {
                    this.infoPoints[orgGroup.id].popSize.shift();
                }
            }
        });
    }
    drawChartAxis() {
        this.infoCtx.strokeStyle = "black";
        this.infoCtx.beginPath();
        this.infoCtx.moveTo(this.chartOffset, this.infoCanvas.height - this.chartOffset);
        this.infoCtx.lineTo(this.chartOffset, 0);

        this.infoCtx.moveTo(this.chartOffset, this.infoCanvas.height - this.chartOffset);
        this.infoCtx.lineTo(this.infoCanvas.width, this.infoCanvas.height - this.chartOffset);
        this.infoCtx.stroke();
    }
    drawChart(intervalType) {
        let organismIds = Object.keys(this.infoPoints);
        let numJump = 0;
        organismIds.forEach(orgId => {
            this.infoCtx.strokeStyle = this.infoPoints[orgId].orgColor;
            let timeInterval = 0;
            if (intervalType == "hour") {
                numJump = 1;
            } else if (intervalType == "day") {
                numJump = 24;
            } else if (intervalType == "month") {
                numJump = 24 * 30;
            } else {
                numJump = 1;
            }
            this.infoCtx.beginPath();
            for (let i = 0; i < this.infoPoints[orgId].popSize.length - 1; i++) {
                this.infoCtx.moveTo(timeInterval + this.chartOffset, this.infoCanvas.height - this.chartOffset - this.infoPoints[orgId].popSize[i]);
                timeInterval += numJump;
                this.infoCtx.lineTo(timeInterval + this.chartOffset, this.infoCanvas.height - this.chartOffset - this.infoPoints[orgId].popSize[i + 1]);
                if (timeInterval + this.chartOffset > this.infoCanvas.width - this.chartOffset) {
                    this.infoPoints[orgId].popSize.shift();
                }
            }
            this.infoCtx.stroke();
        });
    }
}