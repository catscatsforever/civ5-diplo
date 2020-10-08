const DIPLO1 = 1.443;
const DIPLO2 = 7.000;
const DIPLO3 = 16.023;
const DIPLO4 = -13.758;

const sessions = {Renaissance: [1,1,0], Industrial: [1,2,1], Modern: [2,3,1], UN: [2,4,2]};
let delegates = [2,4,2];
let diplo = {civCount: 0, csCount: 0, civAlive: 0, civNotAlive: 0, csAlive: 0, csConquered: 0, csBoughtOut: 0};

let text1 = document.getElementById("NCivs");
let text2 = document.getElementById("NCSs");

text1.addEventListener("input", process);
text2.addEventListener("input", process);

function getVotesNeededForDiploVictory(fCivsToCount, fCityStatesToCount){
    let fCivVotesPortion = (DIPLO1 * Math.log(fCivsToCount)) + DIPLO2;
    if (fCivVotesPortion < 0.0)
    {
        fCivVotesPortion = 0.0;
    }
    let fCityStateVotesPortion = (DIPLO3 * Math.log(fCityStatesToCount)) + DIPLO4;
    if (fCityStateVotesPortion < 0.0)
    {
        fCityStateVotesPortion = 0.0;
    }

    let iVotesToWin = Math.floor(fCivVotesPortion + fCityStateVotesPortion);
    iVotesToWin = Math.max(delegates[0] + delegates[1] + 1, iVotesToWin);
    iVotesToWin = Math.min(delegates[0] + (delegates[1] * Math.floor(fCivsToCount)) + (delegates[2] * Math.floor(fCityStatesToCount)), iVotesToWin);
    return iVotesToWin;
}

function process() {
    diplo.civCount = text1.value < 2 ? 2 : text1.value > 32 ? 32 : text1.value;
    diplo.csCount = text2.value < 0 ? 0 : text2.value > 64 ? 64 : text2.value;
    generate_table(diplo.civCount, diplo.csCount)
}


function generate_table(nCivs, nCSs) {
    let body = document.getElementsByTagName("body")[0];

    let oldCont = document.getElementsByClassName("container1")[0];
    oldCont && oldCont.parentNode.removeChild(oldCont);

    let cont = document.createElement("div");
    cont.className = "container1";
    let cont2 = document.createElement("div");
    let range1 = document.createElement("input");
    range1.type = "range";
    range1.id = "civConquered";
    range1.name = "rangeField";
    range1.min = (nCivs / 2 + 1).toString();
    range1.max = nCivs.toString();
    let range2 = document.createElement("input");
    range2.type = "range";
    range2.id = "csConquered";
    range2.name = "rangeField";
    range2.max = nCSs.toString();
    let range3 = document.createElement("input");
    range3.type = "range";
    range3.id = "csBoughtout";
    range3.name = "rangeField";
    range3.max = nCSs.toString();

    let out1 = document.createElement("output");
    out1.htmlFor = range1.id.toString();
    let out2 = document.createElement("output");
    out2.htmlFor = range2.id.toString();
    let out3 = document.createElement("output");
    out3.htmlFor = range3.id.toString();

    let br = document.createElement("br");
    cont2.append(range1, "civs conquered: ", out1, document.createElement("br"),
                 range2, "city-states conquered: ", out2, document.createElement("br"),
                 range3, "city-states bought out: ", out3);
    cont.appendChild(cont2);

    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");


    let tblHead = tbl.createTHead();
    let hrow = tblHead.insertRow();
    let hth = document.createElement("th");
    let htext = document.createTextNode("");
    hth.appendChild(htext);
    hrow.appendChild(hth);
    for (let j = 0; j <= nCSs; j += 0.5) {
        let th = document.createElement("th");
        let text = document.createTextNode(j.toString());
        th.appendChild(text);
        hrow.appendChild(th);
    }

    for (let i = nCivs / 2 + 1; i <= nCivs; i += 0.5) {
        let row = document.createElement("tr");
        let hcell = document.createElement("td");
        hcell.fontWeight = "bold";
        let hcellText = document.createTextNode(i.toString());
        hcell.appendChild(hcellText);
        row.appendChild(hcell);
        for (let j = 0; j <= nCSs; j += 0.5) {
            let cell = document.createElement("td");
            let cellText = document.createTextNode(getVotesNeededForDiploVictory(i, j).toString());
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }

    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    cont.appendChild(tbl);
    body.appendChild(cont);
}
process();
