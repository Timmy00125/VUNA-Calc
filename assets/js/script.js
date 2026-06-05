var currentExpression = "";
var calculationHistory = [];
var STORAGE_KEY = "vuna_calc_history";
var MAX_HISTORY = 50;

document.addEventListener("DOMContentLoaded", function () {
  loadHistoryFromStorage();
  renderHistory();
});

function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (currentExpression.length === 0) return;
  const actualOperator = value === "×" ? "*" : value === "÷" ? "/" : value;
  currentExpression += actualOperator;
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}

function calculateResult() {
  if (currentExpression.length === 0) return;

  let expression = currentExpression;
  let result;

  try {
    if (!/^[\d+\-*/().\s]+$/.test(expression)) {
      throw new Error("Invalid characters");
    }

    expression = expression.replace(/(\d)\(/g, "$1*(");
    expression = expression.replace(/\)(\d)/g, ")*$1");
    expression = expression.replace(/\)\(/g, ")*(");

    result = Function('"use strict"; return (' + expression + ")")();
    if (typeof result !== "number" || !isFinite(result)) {
      throw new Error("Invalid result");
    }
  } catch (err) {
    currentExpression = "Error";
    updateResult();
    return;
  }

  const resultStr = formatNumber(result);
  saveToHistory(expression, resultStr);
  currentExpression = resultStr;
  updateResult();
}

function formatNumber(n) {
  if (Number.isInteger(n)) return n.toString();
  const rounded = Math.round(n * 1e10) / 1e10;
  return rounded.toString();
}

function updateResult() {
  if (currentExpression === "Error") {
    document.getElementById("result").value = "Error";
    return;
  }
  const display = currentExpression.replace(/\*/g, "×").replace(/\//g, "÷");
  document.getElementById("result").value = display || "0";
}

function saveToHistory(expression, result) {
  const item = {
    expression: expression,
    result: result,
    timestamp: new Date().toISOString(),
  };
  calculationHistory.unshift(item);
  if (calculationHistory.length > MAX_HISTORY) {
    calculationHistory.pop();
  }
  saveHistoryToStorage();
  renderHistory();
}

function clearHistory() {
  if (calculationHistory.length === 0) return;
  if (!confirm("Clear all calculation history?")) return;
  calculationHistory = [];
  saveHistoryToStorage();
  renderHistory();
}

function renderHistory() {
  const historyList = document.getElementById("history-list");
  const clearBtn = document.getElementById("clear-history-btn");

  historyList.innerHTML = "";

  if (calculationHistory.length === 0) {
    const template = document.getElementById("history-empty-template");
    historyList.appendChild(template.content.cloneNode(true));
    clearBtn.disabled = true;
    return;
  }

  clearBtn.disabled = false;
  const template = document.getElementById("history-item-template");

  calculationHistory.forEach((item, index) => {
    const clone = template.content.cloneNode(true);
    const time = formatTimestamp(item.timestamp);
    const displayExpr = item.expression.replace(/\*/g, "×").replace(/\//g, "÷");

    const historyItem = clone.querySelector(".history-item");
    historyItem.onclick = () => loadFromHistory(index);

    clone.querySelector(".history-item-expression").textContent =
      `${displayExpr} = ${item.result}`;
    clone.querySelector(".history-item-time").textContent = time;

    historyList.appendChild(clone);
  });
}

function loadFromHistory(index) {
  const item = calculationHistory[index];
  if (!item) return;
  currentExpression = item.result;
  updateResult();
}

function formatTimestamp(isoString) {
  const d = new Date(isoString);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return time;
  return d.toLocaleDateString() + " " + time;
}

function saveHistoryToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calculationHistory));
  } catch (e) {
    console.error("Failed to save history:", e);
  }
}

function loadHistoryFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      calculationHistory = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load history:", e);
    calculationHistory = [];
  }
}
