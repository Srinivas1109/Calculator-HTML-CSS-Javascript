let stack = [];
let result = "";
let history = "";

// get all buttons by id
const answerBtn = document.getElementById("answer");
const deleteBtn = document.getElementById("delete");
const clearBtn = document.getElementById("clear");

const enterBtn = document.getElementById("enter");

const resultUpperScreen = document.getElementById("upper-screen");
const resultLowerScreen = document.getElementById("lower-screen");

const nonActionButtons = document.getElementsByClassName("non-action");

for (let i = 0; i < nonActionButtons.length; i++) {
  nonActionButtons[i].addEventListener("click", (e) => {
    stack.push(e.target.innerText);
    resultUpperScreen.innerText = stack.join(" ");
  });
}

answerBtn.addEventListener("click", () => {
  resultUpperScreen.innerText = "ans = " + history;
  resultLowerScreen.innerText = 0
});

deleteBtn.addEventListener("click", () => {
  stack.pop();
  resultUpperScreen.innerText = stack.join(" ");
});

clearBtn.addEventListener("click", () => {
  stack.length = 0;
  resultUpperScreen.innerText = stack.join(" ");
  resultLowerScreen.innerText = stack.join(" ");
});

enterBtn.addEventListener("click", () => {
    result = evaluate(stack)
    resultLowerScreen.innerText = result
    history = result
});

function evaluate(expression) {
  let tokens = expression;

  let values = [];

  let ops = [];

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] == " ") {
      continue;
    }

    if (tokens[i] >= "0" && tokens[i] <= "9") {
      let sbuf = "";

      // There may be more than
      // one digits in number
      while (i < tokens.length && tokens[i] >= "0" && tokens[i] <= "9") {
        sbuf = sbuf + tokens[i++];
      }
      values.push(parseInt(sbuf, 10));

      // Right now the i points to
      // the character next to the digit,
      // since the for loop also increases
      // the i, we would skip one
      // token position; we need to
      // decrease the value of i by 1 to
      // correct the offset.
      i--;
    }

    // Current token is an opening
    // brace, push it to 'ops'
    else if (tokens[i] == "(") {
      ops.push(tokens[i]);
    }

    // Closing brace encountered,
    // solve entire brace
    else if (tokens[i] == ")") {
      while (ops[ops.length - 1] != "(") {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      }
      ops.pop();
    }

    // Current token is an operator.
    else if (
      tokens[i] == "+" ||
      tokens[i] == "-" ||
      tokens[i] == "x" ||
      tokens[i] == "/"
    ) {
      // While top of 'ops' has same
      // or greater precedence to current
      // token, which is an operator.
      // Apply operator on top of 'ops'
      // to top two elements in values stack
      while (ops.length > 0 && hasPrecedence(tokens[i], ops[ops.length - 1])) {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      }

      // Push current token to 'ops'.
      ops.push(tokens[i]);
    }
  }

  // Entire expression has been
  // parsed at this point, apply remaining
  // ops to remaining values
  while (ops.length > 0) {
    values.push(applyOp(ops.pop(), values.pop(), values.pop()));
  }

  // Top of 'values' contains
  // result, return it
  return values.pop();
}

// Returns true if 'op2' has
// higher or same precedence as 'op1',
// otherwise returns false.
function hasPrecedence(op1, op2) {
  if (op2 == "(" || op2 == ")") {
    return false;
  }
  if ((op1 == "x" || op1 == "÷") && (op2 == "+" || op2 == "-")) {
    return false;
  } else {
    return true;
  }
}

// A utility method to apply an
// operator 'op' on operands 'a'
// and 'b'. Return the result.
function applyOp(op, b, a) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "x":
      return a * b;
    case "÷":
      if (b == 0) {
        resultLowerScreen.innerText = "Cannot divide by zero";
      }
      return parseInt(a / b, 10);
  }
  return 0;
}

