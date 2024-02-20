"use strict";

let data;
let dataRow = [];

async function createTable(setColor, changeColor) {
    const response = await fetch("https://prog2700.onrender.com/threeinarow/random");
    data = await response.json();
    dataRow = data.rows;
    console.log(dataRow);

    //insert a heading for the page
    let h1 = document.createElement('h1');
    h1.textContent = "Let's play BrainBashers";
    document.body.insertBefore(h1, document.getElementById('theGame'));


    // Create a blank table for the user
    let table = document.createElement('table');
    for (let i = 0; i < dataRow.length; i++) {

        //create 'tr' element for each row based on the json data we retrieved
        let row = document.createElement('tr');

        for (let j = 0; j < dataRow[i].length; j++) {

            // Create a table cell ('td' element) for each row
            let cell = document.createElement('td');
            let cellId = `${i}td${j}`;
            cell.setAttribute('id', cellId);

            //if the cell is toggleable, set a event listener for it
            //when you click on the beige squre, the color and its currentState will change
            if (dataRow[i][j].canToggle == true) {
                cell.addEventListener('click', function () {
                    changeColor(i, j, cell);
                });
            }

            //set default color
            setColor(i, j, cell);

            //set table dimension
            cell.style.width = '80px';
            cell.style.height = '80px';
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    document.getElementById('theGame').appendChild(table);
    table.setAttribute("border", "2");

    let p = document.createElement('p');
    p.innerHTML = "Objective / Rules: <br> Fill the grid with Blue or Pink squares. <br> Every row and column has an equal number of Blue and Pink squares. <br> A 3-In-A-Row of the same color / letter isn't allowed";
    document.body.appendChild(p);

    let section = document.createElement('section');
    // Add button to check three consecutive cells
    addEvent('Check Puzzle', checkPuzzle, 'checkPuzzle', section)
    // Add button to check errors
    addEvent('Check Error', checkError, 'checkError', section)
    // Add button to clear all colors we changed
    addEvent('Clear', clearColors, 'clearColors', section)

    return;
}
createTable(setColor, changeColor);



//callback function to add event listener for each button, can be called in the previous async function
function addEvent(buttonText, buttonFunction, ClassName, section) {
    let Button = document.createElement('button');
    Button.textContent = buttonText;
    Button.addEventListener('click', buttonFunction);
    Button.classList.add(ClassName);
    section.appendChild(Button);
    document.body.appendChild(section);
}


// Set color for each cell for the initial table(set default based on the json data we retrieved)
function setColor(i, j, cell) {
    if (dataRow[i][j].canToggle == true) {
        cell.style.backgroundColor = 'rgb(249, 237, 226)';
    } else if (dataRow[i][j].canToggle == false && dataRow[i][j].currentState == 1) {
        cell.style.backgroundColor = 'rgb(236, 105, 138)';
    } else if (dataRow[i][j].canToggle == false && dataRow[i][j].currentState == 2) {
        cell.style.backgroundColor = 'rgb(163, 206, 228)';
    }
}

//when click on the toggleable cell, change the cell's currentState and the color
function changeColor(i, j, cell) {
    dataRow[i][j].currentState = (dataRow[i][j].currentState + 1) % 3;
    if (dataRow[i][j].currentState == 0) {
        cell.style.backgroundColor = 'rgb(249, 237, 226)';
    } else if (dataRow[i][j].currentState == 1) {
        cell.style.backgroundColor = 'rgb(236, 105, 138)';
    } else if (dataRow[i][j].currentState == 2) {
        cell.style.backgroundColor = 'rgb(163, 206, 228)';
    }
}


//check error
function checkError() {
    for (let i = 0; i < dataRow.length; i++) {
        for (let j = 0; j < dataRow[i].length; j++) {
            let cell = document.getElementById(`${i}td${j}`)
            if (dataRow[i][j].canToggle == true 
                && dataRow[i][j].currentState !== 0
                && dataRow[i][j].currentState !== dataRow[i][j].correctState) {
                    if (cell.textContent === 'X') {
                        cell.textContent = '';
                    } else {
                        cell.textContent = 'X';
                    }
                   
                }
            }
        }

}

//clear colors to reset the game
function clearColors() {
    for (let i = 0; i < dataRow.length; i++) {
        for (let j = 0; j < dataRow[i].length; j++) {
            if (dataRow[i][j].canToggle == true) {
                let cell = document.getElementById(`${i}td${j}`)
                cell.style.backgroundColor = 'rgb(249, 237, 226)';
            }

        }
    }
}



// Check Puzzle 
function checkPuzzle() {
    let correct = true;
    let completed = true;

    // Check rows
    for (let i = 0; i < dataRow.length; i++) {
        
        for (let j = 0; j < dataRow[i].length; j++) {

            if(dataRow[i][j].currentState !== 0 
                && dataRow[i][j].currentState !== dataRow[i][j].correctState){
                correct = false;
            }

            if (j >= 2 && dataRow[i][j].currentState == dataRow[i][j - 1].currentState
                && dataRow[i][j].currentState == dataRow[i][j - 2].currentState 
                && dataRow[i][j].currentState !== 0) {
                correct = false;
            }
        }
        
    }

    // Check columns
    for (let j = 0; j < dataRow[0].length; j++) {
        
        for (let i = 0; i < dataRow.length; i++) {

            if(dataRow[i][j].currentState !== 0 
                && dataRow[i][j].currentState !== dataRow[i][j].correctState){
                correct = false;
            }

            // Check for three consecutive vertically
            if (i >= 2 && dataRow[i][j].currentState == dataRow[i - 1][j].currentState
                && dataRow[i][j].currentState == dataRow[i - 2][j].currentState
                && dataRow[i][j].currentState !== 0) {
                correct = false;
            }
        }
       
    }

    // Check if there has beige square
    for (let i = 0; i < dataRow.length; i++) {
        for (let j = 0; j < dataRow[i].length; j++) {
            if (dataRow[i][j].canToggle && dataRow[i][j].currentState == 0) {
                completed = false;
            }
        }
    }

    if (correct && !completed) {
        alert("So far so good (all colored squares are correct but the puzzle is incomplete).");
    } else if (!correct) {
        alert("Something is wrong (one or more of the colored squares is incorrectly assigned or a 3-In-A-Row is detected).");
    } else {
        alert("You did it!! ");
    }
}



