let heights = []; // Array to hold heights
const heightContainer = document.getElementById("height-container");
const resultDisplay = document.getElementById("result");
const stackDisplay = document.getElementById("stack-display");
const stepInfo = document.getElementById("step-info"); // For displaying step information
let currentStep = 0;
const steps = [];

const createColumns = (heights) => {
  heightContainer.innerHTML = ""; // Clear previous columns
  heights.forEach((height) => {
    const column = document.createElement("div");
    column.classList.add("column");
    column.style.height = `${height * 20}px`; // Scale for visualization
    heightContainer.appendChild(column);
  });
};

class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
    updateStackDisplay();
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }
    const popped = this.items.pop();
    updateStackDisplay();
    return popped;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  peek() {
    return this.isEmpty() ? null : this.items[this.items.length - 1];
  }

  getItems() {
    return this.items;
  }
}

const stack = new Stack();

const calculateTrappedWater = () => {
  const n = heights.length;
  let totalWater = 0;
  stack.items = []; // Reset stack for new calculation
  steps.length = 0; // Clear previous steps

  // Use a stack to keep track of the bars
  for (let i = 0; i < n; i++) {
    while (!stack.isEmpty() && heights[i] > heights[stack.peek()]) {
      const top = stack.pop(); // Pop the top element
      steps.push({ type: "pop", stack: [...stack.getItems()], totalWater });

      if (stack.isEmpty()) {
        break; // No left boundary
      }

      const distance = i - stack.peek() - 1; // Distance to the next bar
      const boundedHeight =
        Math.min(heights[i], heights[stack.peek()]) - heights[top];
      totalWater += distance * boundedHeight; // Calculate trapped water
      steps.push({ type: "water", stack: [...stack.getItems()], totalWater });
    }
    stack.push(i); // Push current index to the stack
    steps.push({ type: "push", stack: [...stack.getItems()], totalWater });
  }

  return totalWater;
};

const updateStackDisplay = () => {
  stackDisplay.innerHTML = ""; // Clear previous stack display
  if (steps.length === 0) return; // Ensure there are steps to display

  const step = steps[currentStep];
  step.stack.forEach((index) => {
    const item = document.createElement("div");
    item.classList.add("stack-item");
    item.style.height = `${heights[index] * 20}px`; // Scale for visualization
    stackDisplay.appendChild(item);
  });
};

const updateVisualization = () => {
  if (steps.length === 0) return; // If there are no steps, return

  const step = steps[currentStep]; // Get the current step
  createColumns(heights);

  // Update the stack display
  updateStackDisplay();

  // Update the result display
  resultDisplay.innerText = `Total Trapped Water so far: ${step.totalWater} units`;

  // Optionally, indicate the step type (push, pop, or water calculation)
  stepInfo.innerText = `Step ${currentStep + 1}: ${step.type}`;
};

// Event listeners for input and buttons
document.getElementById("submit-btn").addEventListener("click", () => {
  const input = document.getElementById("height-input").value;
  heights = input.split(",").map(Number); // Convert input string to array of numbers
  currentStep = 0; // Reset step on new input
  const totalWater = calculateTrappedWater(); // Calculate and record steps
  updateVisualization();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateVisualization();
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    updateVisualization();
  }
});

// Initial visualization (empty)
updateVisualization();
