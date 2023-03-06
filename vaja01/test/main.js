const simCanvasConf = {
    id: "simulation-canvas",
    width: 1000,
    height: 1000
};

const infoCanvasConf = {
    id: "information-canvas",
    width: 500,
    height: 500
};

const drawComponent = new DrawComponent(simCanvasConf, infoCanvasConf);

let spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
let spawnPoint = new Vector(Math.random() * 900 + 100, Math.random() * 900 + 100);
let organismGroup_Insects = new OrganismGroup("insect", 10, 0.2, 0.1, 0.0005, 2, "#4C9900", spawnPoint, spawnVelocity);

spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
spawnPoint = new Vector(Math.random() * 800 + 100, Math.random() * 800 + 100);
let organismGroup_Birds = new OrganismGroup("bird", 8, 0.1, 0.04, 0.0007, 4, "#004C99", spawnPoint, spawnVelocity);

spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
spawnPoint = new Vector(Math.random() * 900 + 100, Math.random() * 900 + 100);
let organismGroup_Cats = new OrganismGroup("cat", 2, 0.05, 0.02, 0.001, 8, "#000000", spawnPoint, spawnVelocity);

let organismGroups = [organismGroup_Insects, organismGroup_Birds, organismGroup_Cats];

const dateTimeTracker = new DateTimeTracker();

let ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
ecoSystem.addOrganismGroup(organismGroup_Insects);
ecoSystem.addOrganismGroup(organismGroup_Birds);
ecoSystem.addOrganismGroup(organismGroup_Cats);

let state = new State(drawComponent, organismGroups, 0);

//var run = true;
const gui = new GuiLogic();
gui.addEventListeners();
gui.loadScenario01();


/*
const runAnimation = (animation) => {
    let lastTime = null;
    const frame = (time) => {
        if (lastTime != null) {
            const timeStep = Math.min(100, time - lastTime) / 1000;

            if (animation(timeStep) === false) {
                return;
            }
        }
        lastTime = time;
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}


runAnimation(time => {
    if (run) {
        state.updateOrganismGroups(gui.ecoSystem.organismGroups);
        state = state.update();
        drawComponent.sync(state);
    }
});
//drawComponent.drawOrganism(ant01);
*/