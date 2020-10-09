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
    generate_table(diplo.civCount, diplo.csCount);
    updateArgs();
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
    range1.min = "0";
    range1.max = (nCivs - 2).toString();
    range1.value = "0";
    range1.addEventListener("input", updateArgs);
    let span1 = document.createElement("span");
    span1.id = "span1";
    span1.textContent = "0";
    let range2 = document.createElement("input");
    range2.type = "range";
    range2.id = "csConquered";
    range2.max = nCSs.toString();
    range2.value = "0";
    range2.addEventListener("input", updateArgs);
    let span2 = document.createElement("span");
    span2.id = "span2";
    span2.textContent = "0";
    let range3 = document.createElement("input");
    range3.type = "range";
    range3.id = "csBoughtOut";
    range3.max = nCSs.toString();
    range3.value = "0";
    range3.addEventListener("input", updateArgs);
    let span3 = document.createElement("span");
    span3.id = "span3";
    span3.textContent = "0";

    cont2.append("civs conquered: ", range1, span1, document.createElement("br"),
                 "city-states conquered: ", range2, span2, document.createElement("br"),
                 "city-states bought out: ", range3, span3);
    cont.appendChild(cont2);

    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");


    let tblHead = tbl.createTHead();
    let hrow = tblHead.insertRow();
    let hth = document.createElement("th");
    let htext = document.createTextNode("");
    hth.appendChild(htext);
    hrow.appendChild(hth);

    let colgr = document.createElement("colgroup");
    let hcol = document.createElement("col");
    colgr.appendChild(hcol);
    for (let j = 0; j <= nCSs; j += 0.5) {
        let col = document.createElement("col");
        col.id = "col" + (j * 2 + 1).toString();
        col.position = "relative";
        if (j == nCSs) col.className = "hCol";
        colgr.appendChild(col);

        let th = document.createElement("th");
        let text = document.createTextNode(j.toString());
        th.appendChild(text);
        hrow.appendChild(th);
    }

    tbl.appendChild(colgr);

    let rowK = 0;
    for (let i = nCivs / 2 + 1; i <= nCivs; i += 0.5) {
        rowK++;
        let row = document.createElement("tr");
        row.id = "row" + rowK.toString();
        row.position = "relative";
        if (i == nCivs) row.className = "hRow";
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

function updateHighlight() {
    let row = diplo.civCount - 1 - diplo.civNotAlive;
    let col = diplo.csCount * 2 + 1 - diplo.csBoughtOut * 2 - diplo.csConquered;

    let hRow = document.getElementsByClassName("hRow");
    let hCol = document.getElementsByClassName("hCol");
    let tbl = document.getElementsByTagName("table");
    let colGr = document.getElementsByTagName("colgroup");

    let sRow = "row" + row.toString();
    let sCol = "col" + col.toString();

    if (hRow && tbl[0] && colGr[0] && hRow[0].id != sRow) {
        hRow[0].className = "";
        let tHRow = document.getElementById(sRow);
        tHRow.className = "hRow";
    }
    if (hCol && tbl[0] && colGr[0] && hCol[0].id != sCol) {
        hCol[0].className = "";
        let tHCol = document.getElementById(sCol);
        tHCol.className = "hCol";
    }
}

function updateArgs(e) {
    let range1 = document.getElementById("civConquered");
    let range2 = document.getElementById("csConquered");
    let range3 = document.getElementById("csBoughtOut");
    let span1 = document.getElementById("span1");
    let span2 = document.getElementById("span2");
    let span3 = document.getElementById("span3");

    let r1Val = range1.valueAsNumber;
    let r2Val = range2.valueAsNumber;
    let r3Val = range3.valueAsNumber;

    if (r2Val + r3Val > diplo.csCount) {
        e.target === range2 ? r3Val = diplo.csCount - r2Val : r2Val = diplo.csCount - r3Val;
    }

    range2.value = r2Val;
    range3.value = r3Val;
    span1.textContent = r1Val;
    span2.textContent = r2Val;
    span3.textContent = r3Val;

    diplo.civNotAlive = r1Val;
    diplo.csConquered = r2Val;
    diplo.csBoughtOut = r3Val;

    updateHighlight();
}
process();



