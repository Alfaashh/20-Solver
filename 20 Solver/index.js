document
  .getElementById('solverForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    document.getElementById('solution').innerHTML = '';
    document.getElementById('solutionLabel').innerHTML = '';

    const number1 = document.getElementById('first').value;
    const number2 = document.getElementById('second').value;
    const number3 = document.getElementById('third').value;
    const number4 = document.getElementById('fourth').value;

    const numbers = [number1, number2, number3, number4];

    if (numbers.every((number) => !isNaN(number) && number < 31)) {
      findSolutions(numbers);
    } else {
      document.getElementById('solution').innerHTML = 'Invalid number input.';
    }
  });

const operators = ['+', '-', '*', '/'];

function evaluateExpression(expression) {
  try {
    return Function('"use strict";return (' + expression + ')')();
  } catch {
    return NaN;
  }
}

function generateUniqueExpressions(nums, ops) {
  const expressions = new Set();
  const plusExpression = new Set();

  function addExpressions(a, b, c, d) {
    ops.forEach((op1) => {
      ops.forEach((op2) => {
        ops.forEach((op3) => {
          // Considering commutative property for +
          if (op1 === op2 && op2 === op3 && op1 === '+') {
            if (plusExpression.size == 0) {
              plusExpression.add(`${a}${op1}${b}${op2}${c}${op3}${d}`);
            } else {
              return;
            }

            for (const expression of plusExpression) {
              expressions.add(expression);
            }
          } else {
            // General case
            // ((n0 op0 n1) op1 n2) op2 d3
            expressions.add(`((${a}${op1}${b})${op2}${c})${op3}${d}`);
            // (n0 op0 (n1 op1 n2)) op2 d3
            expressions.add(`(${a}${op1}(${b}${op2}${c}))${op3}${d}`);
            // // (n0 op0 n1) op1 (n2 op2 n3)
            expressions.add(`(${a}${op1}${b})${op2}(${c}${op3}${d})`);
            // n0 op0 ((n1 op1 n2) op2 n3)
            expressions.add(`${a}${op1}((${b}${op2}${c})${op3}${d})`);
            // n0 op0 (n1 op1 (n2 op2 n3))
            expressions.add(`${a}${op1}(${b}${op2}(${c}${op3}${d}))`);
          }
        });
      });
    });
  }

  // Generate expressions by permuting nums and applying ops
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (j === i) continue;
      for (let k = 0; k < nums.length; k++) {
        if (k === i || k === j) continue;
        const l = nums.findIndex(
          (_, index) => index !== i && index !== j && index !== k
        );
        addExpressions(nums[i], nums[j], nums[k], nums[l]);
      }
    }
  }
  return Array.from(expressions);
}

function findSolutions(nums) {
  const expressions = generateUniqueExpressions(nums, operators);
  const solutions = new Set();

  for (const expr of expressions) {
    if (evaluateExpression(expr) === 20) {
      const formattedExpr = expr.replace(/([+\-*/])/g, ' $1 ').trim();
      solutions.add(formattedExpr);
    }
  }

  const solutionElement = document.getElementById('solution');
  const solutionLabel = document.getElementById('solutionLabel');

  if (solutions.size > 0) {
    solutionElement.innerHTML = Array.from(solutions).join('<br>');

    solutionLabel.innerHTML =
      solutions.size + ' solution' + (solutions.size > 1 ? 's' : '');
  } else {
    solutionElement.innerHTML = 'No solution found';
    solutionLabel.innerHTML = '';
  }
}
