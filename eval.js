function calc(expression) {
    let expressionNoSpace = expression.replaceAll(" ", "");
    for (let i = 0; i < expressionNoSpace.length; i++) {
        const lastIndexOfOpen = expressionNoSpace.lastIndexOf("(");
        let firstIndexOfClose;
        for (let j = lastIndexOfOpen; j < expressionNoSpace.length; j++) {
            if (expressionNoSpace[j] === ")") {
                firstIndexOfClose = j;
                break;
            }
        }
        const expressionBetween = expressionNoSpace.slice(
            lastIndexOfOpen,
            firstIndexOfClose + 1
        );
        const expressionBetweenEval = evalExpNoBracket(
            expressionBetween.slice(1, expressionBetween.length - 1)
        );
        expressionNoSpace = expressionNoSpace.replace(
            expressionBetween,
            expressionBetweenEval
        );
        if (lastIndexOfOpen === -1 || !firstIndexOfClose) {
            break;
        }
    }
    return evalExpNoBracket(expressionNoSpace);
}

// Mandamina ny operateur
function removeDuplOperator(exp) {
    for (let i = 0; i < exp.length; i++) {
        if (exp[i] === "-" && exp[i + 1] === "-") {
            exp = exp.replaceAll("--", "+");
            i = 0;
        } else if (
            (exp[i] === "+" && exp[i + 1] === "-") ||
            (exp[i] === "-" && exp[i + 1] === "+")
        ) {
            exp = exp.replaceAll("-+", "-");
            exp = exp.replaceAll("+-", "-");
            i = 0;
        } else if (exp[i] === "+" && exp[i + 1] === "+") {
            exp = exp.replaceAll("++", "+");
            i = 0;
        }
    }
    console.log("Operateur milamina : ", exp);
    return exp;
}

// Mievalue expression tsy misy entre parenthese
function evalExpNoBracket(exp) {
    if (Number(exp)) {
        return Number(exp);
    }

    exp = removeDuplOperator(exp);

    const divIndex = exp.lastIndexOf("/");
    const multIndex = exp.lastIndexOf("*");
    const addIndex = exp.lastIndexOf("+");
    const subIndex = exp.lastIndexOf("-");

    if (multIndex < divIndex) {
        // Pour les multiplications
        if (multIndex !== -1) {
            exp = opLogic(exp, multIndex, "*");
            return evalExpNoBracket(exp);
        }
        // Pour la division
        if (divIndex !== -1) {
            exp = opLogic(exp, divIndex, "/");
            return evalExpNoBracket(exp);
        }
    } else {
        // Pour la division
        if (divIndex !== -1) {
            exp = opLogic(exp, divIndex, "/");
            return evalExpNoBracket(exp);
        }
        // Pour les multiplications
        if (multIndex !== -1) {
            exp = opLogic(exp, multIndex, "*");
            return evalExpNoBracket(exp);
        }
    }

    // Pour l'addition
    if (addIndex !== -1) {
        exp = opLogic(exp, addIndex, "+");
        return evalExpNoBracket(exp);
    }

    // Pour la soustraction
    if (subIndex !== -1) {
        exp = opLogic(exp, subIndex, "-");
        return evalExpNoBracket(exp);
    }

    return 0;
}

// Operation logique
function opLogic(exp, multIndex, operateur) {
    console.log("----------------------------------------------------------");
    const firstValue = getFirst(exp, multIndex);
    const lastValue = getLast(exp, multIndex);
    let value;
    if (operateur === "/")
        value = Number(firstValue.value) / Number(lastValue.value);
    else if (operateur === "*")
        value = Number(firstValue.value) * Number(lastValue.value);
    else if (operateur === "+")
        value = Number(firstValue.value) + Number(lastValue.value);
    else if (operateur === "-") {
        console.log("Je suis l'operateur : -");
        value = Number(firstValue.value) - Number(lastValue.value);
    }
    const valueToReplace = exp.slice(
        firstValue.indexValue,
        lastValue.indexValue
    );
    if (value > 0) {
        console.log(
            "First index : ",
            firstValue.indexValue,
            "Last index : ",
            lastValue.indexValue
        );
        if (firstValue.indexValue === 0) {
            value = value;
        } else if (valueToReplace[0] === "/") {
            value = "/" + value;
        } else {
            value = "+" + value;
        }
    }
    console.log(`Les deux valeurs : ${firstValue.value} || ${lastValue.value}`);
    console.log("Valeur :", value);
    console.log("Remplacement :", valueToReplace);
    console.log("Encien valeur : ", exp);
    exp = exp.replaceAll(valueToReplace, value);
    console.log(`Nouveau : ${exp}`);
    return exp;
}

// Maka ny aloha sy aorina na operateur
function getFirst(exp, index) {
    let indexValue = index - 1;
    let value = exp[indexValue];
    while (true) {
        indexValue--;
        if (exp[indexValue] === "-") value += "-";
        if (
            exp[indexValue] !== "." &&
            !Number(exp[indexValue]) &&
            exp[indexValue] !== "0"
        )
            break;
        value += exp[indexValue];
    }
    if (!value) {
        return {
            value: 0,
            indexValue,
        };
    }
    if (indexValue === -1) {
        indexValue++;
    }
    value = value.split("").reverse().join("");
    return {
        value,
        indexValue,
    };
}
function getLast(exp, index) {
    let indexValue = index + 1;
    let value = exp[indexValue];
    while (true) {
        indexValue++;
        if (
            exp[indexValue] !== "." &&
            !Number(exp[indexValue]) &&
            exp[indexValue] !== "0"
        ) {
            break;
        }
        value += exp[indexValue];
    }
    if (exp[indexValue] === "0" || Number(exp[indexValue])) {
        console.log("good");
        indexValue++;
    }
    return {
        value,
        indexValue,
    };
}

console.log(
    calc("-(89) - (-17 * -71 * -(31)) + (92 - -((((24 - 77)))) + -49)")
);
