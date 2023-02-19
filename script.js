initializeButtons();
addEventListener('keydown', keyPress);

//Creates event listeners for on-screen buttons
function initializeButtons() {
    const buttons = document.querySelectorAll('button') 
    buttons.forEach( (button) => {
        const classes = button.classList;
        if(classes.contains('num')){
            button.addEventListener('click', numClick);
        } else if (classes.contains('operator')) {
            button.addEventListener('click', operatorClick);
        }
        else if (button.id == 'equals') {
            button.addEventListener('click', equalsClick);
        }
        else if (button.id == 'clear') {
            button.addEventListener('click', clear);
        } 
        else if (button.id == "decimal") {
            button.addEventListener('click', decimalClick);
        }
        else {
            button.addEventListener('click', del);
        }
    })
}

function keyPress(e) {
    const key = e.key;
    switch(key) {
        case ".": 
            decimalClick();
            break;
        case "=": 
        case "Enter":
            equalsClick();
            break;
        case "Backspace": 
            del();
            break;
        case "Escape": 
            clear();
            break;
        case "*":
        case "/":
        case "-":
        case "+":
            operatorClick(key);
            break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
            numClick(key);
    }
}


//adds a number to the output's textcontent
function numClick (e) {
    const output = getOutput();
    if(checkError(output.textContent)) clear();
    let num;
    if(typeof e == "string") {
        num = e;
    } else {
        num = e.target.textContent; 
    }
    
    addToOutput(num);
}

function equalsClick () {
    const output = getOutput();
    const expressionArr = toWordArray(output.textContent);
    const answer = evaluate(expressionArr);
    clear();
    addToOutput(answer);
}

//clears the outputs textcontent
function clear () {
    const output = getOutput();
    output.textContent = '';
}

//checks if an expression already has an operator, and if so evaluates it, then adds the clicked operator to output's textcontent
function operatorClick (e) {
    const output = getOutput();
    if(checkError(output.textContent) || output.textContent == '') return;
    let symbol;
    if(typeof e == 'string') {
        switch (e) {
            case "+": 
                symbol = "+";
                break;
            case "-": 
                symbol = "−";
                break;
            case "*": 
                symbol = "×";
                break;
            case "/": 
                symbol = "÷";
                break;
        }
    } else {
        symbol = e.target.textContent;
    }
    const expressionArr = toWordArray(output.textContent);
    const hasSign = expressionArr.some(word => isSign(word))
    if(hasSign) {
        const answer = evaluate(expressionArr);
        clear();
        addToOutput(answer);
    }
    if(!checkError(output.textContent)){
        addToOutput(` ${symbol} `);
    } 
}

//evaluates an mathmatical expression in array form
function evaluate (expressionArr) {
    let num1 = expressionArr[0];
    num1 = hasDecimal(num1) ? parseFloat(num1) : parseInt(num1);
    const operator = expressionArr[1];
    let num2 = expressionArr[2];
    if (num2.charAt(num2.length-1) == "."){
        num2 = num2.substring(0, num2.length - 1);
        if(num2 == '') return num1;
    }
    num2 = hasDecimal(num2) ? parseFloat(num2) : parseInt(num2);
    if (operator == "÷" && num2 == 0) return "You can't divide by 0 silly";
    switch (operator) {
        case "+": return num1 + num2;
        case "−": return num1 - num2;
        case "×": return num1 * num2;
        case "÷": return num1 / num2;
    }
}

//removes one part of the expression in output
function del () {
    const output = getOutput();
    let outputText = output.textContent;
    outputText = outputText.trim();
    output.textContent = outputText.substring(0, outputText.lastIndexOf(' '));
}

//Adds a decimal to the current number if it doesn't already have one
function decimalClick () {
    const output = getOutput();
    const currentNum = output.textContent.substring(output.textContent.lastIndexOf(' '));
    if(!hasDecimal(currentNum)){
        output.textContent += '.';
    }
}

//Checks if the the last character in the expression is an operator
function checkEnding (expression) {
    const lastItem = expression.charAt(expression.length - 1);
    return isSign(lastItem);
}

//Uses spaces to create an array of words from a sentence or expression
function toWordArray (input) {
    input = input.trim();
    let wordArr =[];
    while (input.includes(' ')) {
        wordArr.push(input.substring(0, input.indexOf(' ')));
        input = input.substring(input.indexOf(' ') + 1);
    }
    wordArr.push(input);
    return wordArr
}

//checks if the given word is an operator
function isSign (word) {
    return word.length == 1 && (word == "+" ||word == "÷" ||word == "×" ||word == "−" || word == ".");
}

//Adds a given expression to the output text
function addToOutput(str) {
    const output = getOutput();
    output.textContent += str;
}

//returns the output DOM element
function getOutput() {
    return document.querySelector('.output');
}

//returns true if a number has a decimal point
function hasDecimal (str) {
    return str.includes('.');
}

//Checks if the output text is the divide by 0 error text
function checkError(expression) {
    return expression == "You can't divide by 0 silly";
}
