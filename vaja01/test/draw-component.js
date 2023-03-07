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
        this.timeStamp++;
        this.clearSimCanvas();
        this.drawAllOrganisms(state.organismGroups);
        if (this.timeStamp % 20) {
            this.updateChartPoints(state.organismGroups, true);
        } else {
            this.updateChartPoints(state.organismGroups, false);
        }
        if (Math.floor(state.timePassed) % 1 == 0) {
            this.clearChartCanvas();
            this.drawChart(state.timePassed);
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
    updateChartPoints(organismGroups, showTimeStamp) {
        organismGroups.forEach(orgGroup => {
            if (this.infoPoints[orgGroup.type] === undefined) {
                this.infoPoints[orgGroup.type] = {
                    orgColor: orgGroup.orgColor,
                    popSize: [orgGroup.popSize]
                };
            } else {
                if (this.infoPoints[orgGroup.type]["orgColor"] != orgGroup.orgColor) {
                    this.infoPoints[orgGroup.type]["orgColor"] = orgGroup.orgColor;
                    if (showTimeStamp) {
                        this.infoPoints[orgGroup.type]["showTimeStamp"] = true;
                    } else {
                        this.infoPoints[orgGroup.type]["showTimeStamp"] = false;
                    }
                }
                this.infoPoints[orgGroup.type]["popSize"].push(orgGroup.popSize);
                if (showTimeStamp) {
                    this.infoPoints[orgGroup.type]["showTimeStamp"] = true;
                } else {
                    this.infoPoints[orgGroup.type]["showTimeStamp"] = false;
                }
                if (this.infoPoints[orgGroup.type]["popSize"].length > this.infoCanvas.width) {
                    this.infoPoints[orgGroup.type]["popSize"].shift();
                }
            }
        });
    }
    drawChart(timePassed) {
        this.infoCtx.strokeStyle = "black";
        this.infoCtx.beginPath();
        this.infoCtx.moveTo(20, this.infoCanvas.height - 20);
        this.infoCtx.lineTo(20, 0);

        this.infoCtx.moveTo(20, this.infoCanvas.height - 20);
        this.infoCtx.lineTo(this.infoCanvas.width, this.infoCanvas.height - 20);
        this.infoCtx.stroke();

        let organismTypes = Object.keys(this.infoPoints);
        organismTypes.forEach(orgType => {
            this.infoCtx.strokeStyle = this.infoPoints[orgType]["orgColor"];
            let count = 0;
            let timeInterval = 0;
            this.infoCtx.beginPath();
            for (let i = 0; i < this.infoPoints[orgType]["popSize"].length - 1; i++) {
                this.infoCtx.moveTo(timeInterval + 20, this.infoCanvas.height - 20 - this.infoPoints[orgType]["popSize"][i]);
                timeInterval += 1;
                this.infoCtx.lineTo(timeInterval + 20, this.infoCanvas.height - 20 - this.infoPoints[orgType]["popSize"][i + 1]);
                if (this.infoPoints[orgType]["showTimeStamp"]) {
                    this.infoCtx.fillText("1", timeInterval + 20, this.infoCanvas.height - 10);
                }
                count++;
            }
            this.infoCtx.stroke();
        });
    }
}