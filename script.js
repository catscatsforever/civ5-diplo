const DIPLO1 = 1.443;
const DIPLO2 = 7.000;
const DIPLO3 = 16.023;
const DIPLO4 = -13.758;

const sessions = {Renaissance: [1,1,0], Industrial: [1,2,1], Modern: [2,3,1], UN: [2,4,2]};
let delegates = [2,4,2];
let diplo = {civCount: 0, csCount: 0, civAlive: 0, civNotAlive: 0, csAlive: 0, csConquered: 0, csBoughtOut: 0};

let text1 = document.getElementById("NCivs");
let text2 = document.getElementById("NCSs");


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
    let NCivs = text1.textContent;
    let NCSs = text1.textContent;

}

function generate_table(nCivs, nCSs) {
    let body = document.getElementsByTagName("body")[0];

    let range1 = document.createElement("input");
    range1.type = "range";
    range1.id = "civConquered";
    range1.name = "rangeField";
    range1.min = nCivs / 2 + 1;
    range1.max = nCivs;
    range1.step = "0.5";
    let range2 = document.createElement("input");
    range2.type = "range";
    range2.id = "csConquered";
    range2.name = "rangeField";
    range2.min = "0";
    range2.max = nCSs;
    range2.step = "0.5";

    body.appendChild(range1);
    body.appendChild(range2);

    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");


    let tblHead = tbl.createTHead();
    let hrow = tblHead.insertRow();
    let hth = document.createElement("th");
    let htext = document.createTextNode("");
    hth.appendChild(htext);
    hrow.appendChild(hth);
    for (let j = 0; j <= 12; j += 0.5) {
        let th = document.createElement("th");
        let text = document.createTextNode(j.toString());
        th.appendChild(text);
        hrow.appendChild(th);
    }

    for (let i = 4; i <= 6; i += 0.5) {
        let row = document.createElement("tr");
        let hcell = document.createElement("td");
        hcell.fontWeight = "bold";
        let hcellText = document.createTextNode(i.toString());
        hcell.appendChild(hcellText);
        row.appendChild(hcell);
        for (let j = 0; j <= 12; j += 0.5) {
            let cell = document.createElement("td");
            let cellText = document.createTextNode(getVotesNeededForDiploVictory(i, j).toString());
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }

    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    body.appendChild(tbl);
}
generate_table();
