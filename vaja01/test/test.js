
let infoPoints = {};
const testFun = () => {

    let organismGourp_Insects = new OrganismGroup("insect", 10, 0.1, 0.05, 0.0005, 2, "green", new Vector(500, 500), new Vector(3, 3));
    let organismGourp_Birds = new OrganismGroup("bird", 8, 0.1, 0.05, 0.0005, 4, "blue", new Vector(500, 500), new Vector(2, 2));
    let organismGourp_Cats = new OrganismGroup("cat", 2, 0.1, 0.05, 0.0005, 8, "black", new Vector(500, 500), new Vector(1, 1));
    let organismGroups = [organismGourp_Insects, organismGourp_Birds, organismGourp_Cats];

    organismGroups.forEach(orgGroup => {

        if (infoPoints[orgGroup.type] === undefined) {
            infoPoints[orgGroup.type] = [orgGroup.popSize];
        } else {
            infoPoints[orgGroup.type].push(orgGroup.popSize);
        }
    });

}

testFun();
testFun();

let keys = Object.keys(infoPoints);
keys.forEach(key => {
    console.log(infoPoints[key]);
})
