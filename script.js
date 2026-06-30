const screenDisplay = document.querySelector('.blank');
const buttons = document.querySelectorAll('button');

let expression = ''; 

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.value;

        // Clear button
        if (value === 'C') {
            expression = '';
            updateDisplay('0');
            return;
        }

        // Equals button (Evaluate expression)
        if (value === '=') {
            if (!expression) return;
            try {
                // Replace visual math symbols with JavaScript operators
                let formattedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
                
                // Calculate the final answer safely
                let result = Function(`"use strict"; return (${formattedExpression})`)();
                
                // Format decimal lengths to prevent overflow
                if (result % 1 !== 0) {
                    result = parseFloat(result.toFixed(8));
                }
                
                expression = result.toString();
                updateDisplay(expression);
            } catch (error) {
                alert('Invalid Math Expression');
                expression = '';
                updateDisplay('Error');
            }
            return;
        }

        // Percentage button
        if (value === '%') {
            if (expression && !isNaN(expression.slice(-1))) {
                expression += '/100';
                updateDisplay(expression);
            }
            return;
        }

        // Toggle sign (+/-)
        if (value === '+/-') {
            alert('Use the minus (-) button to type negative values in long expressions.');
            return;
        }

        // Help button
        if (value === 'help') {
            alert('Chain Calculator\n\nType as many numbers and operators as you want! The full string will show on screen. Press "=" to calculate.');
            return;
        }

        // Prevent adding multiple decimals in one number
        if (value === '.') {
            const parts = expression.split(/[\+\-\×\÷]/);
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes('.')) return;
        }

        // Prevent consecutive operators (e.g., ++ or +×)
        const operators = ['+', '-', '×', '÷'];
        if (operators.includes(value) && operators.includes(expression.slice(-1))) {
            return; 
        }

        // Build the expression string
        if (expression === '' && operators.includes(value) && value !== '-') {
            return; // Don't start expression with operators except minus
        }

        expression += value;
        updateDisplay(expression);
    });
});

function updateDisplay(text) {
    screenDisplay.textContent = text || '0';
    // Auto-scroll the screen to the right so long formulas stay visible
    const screenContainer = document.querySelector('.screen');
    screenContainer.scrollLeft = screenContainer.scrollWidth;
}
