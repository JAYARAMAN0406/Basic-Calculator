const calculator = document.getElementById('calculator');
    const modeIcon = document.getElementById('modeIcon');
    const display = document.getElementById('display');
    const equationEl = document.getElementById('equation');
    const resultEl = document.getElementById('result');
    const clearButton = document.getElementById('clearButton');
    const rgbButton = document.getElementById('rgbButton');
    const buttons = document.querySelectorAll('.button');
    let isNewCalculation = false;

    let memoryValue = 0; 
    let currentInput = '';
    let currentInputs = '';
    let currentInputSub = '';
    let currentEquation = '';
    let calculationHistory = [];
    let lastStoredValue = null; 
    let memoryData = []; 
    let historyIndex = -1;
    const MAX_DIGITS = 15;
    let longPressTimeout=0;

    function updateDisplay() {
      resultEl.innerText = currentInput || '0';
      equationEl.innerText = currentEquation;  
    }

    function append(value) {
      const isNumber = /^[0-9.]$/.test(value);
      const isOperator = /^[+\-*/()]$/.test(value);
      const isSquare = value === 'sqr';
      const isCube = value === 'cube';
    
      if (isNewCalculation) {
        if (isNumber) {
          currentInput = value;
          currentEquation = value;
        } else if (isSquare || isCube) {
          handleSquareOrCube(value);
        } else if (isOperator) {
          currentEquation = currentInput + value;
          currentInput = ''; // Allow new input after operator
        }
        isNewCalculation = false;
      } else if (currentInput.length >= MAX_DIGITS && !isOperator) {
        return; // Prevent input if max digits reached
      } else {
        if (isSquare || isCube) {
          handleSquareOrCube(value);
        } else if (isOperator) {
          currentEquation += value;
          currentInput = ''; // Reset for the next input
        } else {
          currentInput += value;
          currentEquation += value;
        }
      }
    
      updateDisplay();
    }
    
    function handleSquareOrCube(value) {
      if (currentInput) {
        const num = parseFloat(currentInput);
        if (value === 'sqr') {
          currentEquation += `(${num})²`; 
          currentInput = Math.pow(num, 2).toString();
        } else if (value === 'cube') {
          currentEquation += `(${num})³`;
          currentInput = Math.pow(num, 3).toString();
        }
      }
    }
    
    
    
    
    function calculate() {
      try {
       
        let sanitizedEquation = currentEquation
          .replace(/(\d+)\²/g, 'Math.pow($1, 2)') 
          .replace(/(\d+)\³/g, 'Math.pow($1, 3)') 
          .replace(/=.+$/, ''); 
    
        console.log("Sanitized equation:", sanitizedEquation);
    
       
        if (/[\+\-\*/]$/.test(sanitizedEquation) || sanitizedEquation.trim() === '') {
          throw new Error("Invalid equation");
        }
    
      
        const result = eval(sanitizedEquation);
    
      
        currentEquation += ` = ${result}`;
        currentInput = result.toString();
    
       
        calculationHistory.push({ equation: currentEquation, result: currentInput });
        historyIndex = calculationHistory.length;
    
        isNewCalculation = true;
        updateDisplay();
      } catch (e) {
        console.error("Error:", e.message);
        resultEl.innerText = 'Error';
        currentInput = '';
        currentEquation = '';
        equationEl.innerText = '';
        isNewCalculation = false;
      }
    }
    
    
    

    function clearAll() {
      currentInput = '';
      currentEquation = '';
      equationEl.innerText = '';
      resultEl.innerText = '0';
      calculationHistory = [];
      historyIndex = -1;
    }

    function backspace() {
      currentInput = currentInput.slice(0, -1);
      currentEquation = currentEquation.slice(0, -1); 
      if(currentInput==''){
        currentEquation=''
      }
      updateDisplay();
    }



    function toggleMode() {
      calculator.classList.toggle('dark-mode');
      modeIcon.textContent = calculator.classList.contains('dark-mode') ? '☀️' : '🌙';
    }

  function toggleRgbLight() {
  const buttons = document.querySelectorAll('.button, .memory-button');
  buttons.forEach(button => {
    button.classList.toggle('rgb-light'); 
  });
}


    function calculatePercentage() {
      if (currentInput) {
        const result = eval(currentInput);
        const percentage = result / 100;
        currentInput = percentage.toString();
        currentEquation = `${currentEquation} = ${result} % = ${percentage}`;
        calculationHistory.push({ equation: currentEquation, result: currentInput });
        historyIndex = calculationHistory.length;
        updateDisplay();
      }
    }

  


function memoryAdd() {
  if (memoryData.length > 0) {
    const lastValue = parseFloat(memoryData[memoryData.length - 1]);
    currentInputs = (parseFloat(currentInput) + lastValue).toString();


    if (currentInputs !== memoryData[memoryData.length - 1]) {
      memoryData.push(currentInputs);
    }


  }
}

function memorySubtract() {
  if (memoryData.length > 0) {
    const lastValue = parseFloat(memoryData[memoryData.length - 1]);
    currentInputSub = (lastValue - parseFloat(currentInput)).toString();

   
    if (currentInputSub !== memoryData[memoryData.length - 1]) {
      memoryData.push(currentInputSub);
    }


  }
}




  function populateDropdown() {
  const dropdown = document.getElementById('memoryDropdown');
  dropdown.innerHTML = '';


  const uniqueValues = [...new Set(memoryData)];

  memoryData.forEach((value) => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.textContent = value;
    
    dropdown.appendChild(item);
  });
}


function memoryReview() {
  if (memoryData.length > 0) {
    currentInput = memoryData[memoryData.length - 1];
    currentEquation = '';
    updateDisplay();
  }
}

    function square() {
      if (currentInput) {
        currentInput = Math.pow(parseFloat(currentInput), 2).toString();
        currentEquation = `${currentEquation}²`;
        updateDisplay();
      }
    }

    function cube() {
      if (currentInput) {
        currentInput = Math.pow(parseFloat(currentInput), 3).toString();
        currentEquation = `${currentEquation}³`;
        updateDisplay();
      }
    }

    function showPrevious() {
      if (historyIndex > 0) {
        historyIndex--;
        const previousCalculation = calculationHistory[historyIndex];
        currentEquation = previousCalculation.equation;
        currentInput = previousCalculation.result;
        updateDisplay();
      }
    }

    function showNext() {
      if (historyIndex < calculationHistory.length - 1) {
        historyIndex++;
        const nextCalculation = calculationHistory[historyIndex];
        currentEquation = nextCalculation.equation;
        currentInput = nextCalculation.result;
        updateDisplay();
      }
    }

    clearButton.addEventListener('mousedown', () => {
      longPressTimeout = setTimeout(clearAll, 1000);
    });

    clearButton.addEventListener('mouseup', () => {
      clearTimeout(longPressTimeout);
    });

    clearButton.addEventListener('mouseleave', () => {
      clearTimeout(longPressTimeout);
    });

    function toggleSign() {
      if (currentInput) {
        if (currentInput.startsWith('-')) {
          currentInput = currentInput.slice(1); 
        } else {
          currentInput = '-' + currentInput; 
        }
        currentEquation = currentInput; 
        updateDisplay();
      }
    }

    
    function toggleMemoryModal() {
      const modal = document.getElementById("memoryModal");
      if (modal.style.display === "block") {
        modal.style.display = "none";
      } else {
        populateMemoryItems();
        modal.style.display = "block";
      }
    }
    
    function closeMemoryModal() {
      document.getElementById("memoryModal").style.display = "none";
    }
    
    function populateMemoryItems() {
      const memoryItemsContainer = document.getElementById("memoryItems");
      memoryItemsContainer.innerHTML = ""; 
    
      if (memoryData.length === 0) {
        memoryItemsContainer.innerHTML = "<p>No memory items.</p>";
        return;
      }
    
      memoryData.forEach((item, index) => {
        const memoryItem = document.createElement("div");
        memoryItem.textContent = `${item}`;
        memoryItemsContainer.appendChild(memoryItem);
      });
    }
    
    function storeMemory() {
      const currentValue = document.getElementById("result").textContent;
      if (currentValue) {
        memoryData.push(currentValue);
      }
    }
    
    function memoryClear() {
      memoryData = [];
      populateMemoryItems();
    }