import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadScript() {
  const scriptPath = resolve(process.cwd(), "assets/js/script.js");
  const code = readFileSync(scriptPath, "utf-8");
  (0, eval)(code);
}

function setupDOM() {
  document.body.innerHTML = `
    <input type="text" id="result" />
    <button id="clear-history-btn"></button>
    <div id="history-list"></div>
    <template id="history-empty-template">
      <div class="text-center text-muted py-5">
        <p class="mb-0">No calculations yet</p>
      </div>
    </template>
    <template id="history-item-template">
      <div class="history-item">
        <div class="history-item-expression"></div>
        <div class="history-item-time"></div>
      </div>
    </template>
  `;
}

function getGlobals() {
  return {
    get currentExpression() { return globalThis.currentExpression; },
    set currentExpression(v) { globalThis.currentExpression = v; },
    get calculationHistory() { return globalThis.calculationHistory; },
    set calculationHistory(v) { globalThis.calculationHistory = v; },
    appendToResult: globalThis.appendToResult,
    bracketToResult: globalThis.bracketToResult,
    backspace: globalThis.backspace,
    operatorToResult: globalThis.operatorToResult,
    clearResult: globalThis.clearResult,
    calculateResult: globalThis.calculateResult,
    formatNumber: globalThis.formatNumber,
    updateResult: globalThis.updateResult,
    saveToHistory: globalThis.saveToHistory,
    clearHistory: globalThis.clearHistory,
    renderHistory: globalThis.renderHistory,
    loadFromHistory: globalThis.loadFromHistory,
    formatTimestamp: globalThis.formatTimestamp,
    saveHistoryToStorage: globalThis.saveHistoryToStorage,
    loadHistoryFromStorage: globalThis.loadHistoryFromStorage,
  };
}

describe("Calculator Logic", () => {
  let g;

  beforeEach(() => {
    setupDOM();
    loadScript();
    globalThis.currentExpression = "";
    globalThis.calculationHistory = [];
    g = getGlobals();
  });

  describe("appendToResult", () => {
    it("should append a number to the expression", () => {
      g.appendToResult(5);
      expect(globalThis.currentExpression).toBe("5");
    });

    it("should append multiple digits", () => {
      g.appendToResult(1);
      g.appendToResult(2);
      g.appendToResult(3);
      expect(globalThis.currentExpression).toBe("123");
    });

    it("should append a decimal point", () => {
      g.appendToResult(3);
      g.appendToResult(".");
      g.appendToResult(1);
      g.appendToResult(4);
      expect(globalThis.currentExpression).toBe("3.14");
    });
  });

  describe("bracketToResult", () => {
    it("should append opening bracket", () => {
      g.bracketToResult("(");
      expect(globalThis.currentExpression).toBe("(");
    });

    it("should append closing bracket", () => {
      g.bracketToResult("(");
      g.appendToResult(1);
      g.bracketToResult(")");
      expect(globalThis.currentExpression).toBe("(1)");
    });
  });

  describe("backspace", () => {
    it("should remove the last character", () => {
      g.appendToResult(1);
      g.appendToResult(2);
      g.appendToResult(3);
      g.backspace();
      expect(globalThis.currentExpression).toBe("12");
    });

    it("should handle empty expression", () => {
      g.backspace();
      expect(globalThis.currentExpression).toBe("");
    });
  });

  describe("operatorToResult", () => {
    it("should append an operator", () => {
      g.appendToResult(5);
      g.operatorToResult("+");
      expect(globalThis.currentExpression).toBe("5+");
    });

    it("should not append operator to empty expression", () => {
      g.operatorToResult("+");
      expect(globalThis.currentExpression).toBe("");
    });

    it("should convert × to *", () => {
      g.appendToResult(5);
      g.operatorToResult("×");
      expect(globalThis.currentExpression).toBe("5*");
    });

    it("should convert ÷ to /", () => {
      g.appendToResult(5);
      g.operatorToResult("÷");
      expect(globalThis.currentExpression).toBe("5/");
    });
  });

  describe("clearResult", () => {
    it("should clear the expression", () => {
      g.appendToResult(1);
      g.appendToResult(2);
      g.clearResult();
      expect(globalThis.currentExpression).toBe("");
    });
  });

  describe("calculateResult", () => {
    it("should calculate simple addition", () => {
      g.appendToResult(2);
      g.operatorToResult("+");
      g.appendToResult(3);
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("5");
    });

    it("should calculate subtraction", () => {
      g.appendToResult(9);
      g.operatorToResult("-");
      g.appendToResult(4);
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("5");
    });

    it("should calculate multiplication", () => {
      g.appendToResult(3);
      g.operatorToResult("*");
      g.appendToResult(4);
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("12");
    });

    it("should calculate division", () => {
      g.appendToResult(8);
      g.operatorToResult("/");
      g.appendToResult(2);
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("4");
    });

    it("should handle complex expressions", () => {
      g.appendToResult(2);
      g.operatorToResult("+");
      g.appendToResult(3);
      g.operatorToResult("*");
      g.appendToResult(4);
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("14");
    });

    it("should handle parentheses", () => {
      g.bracketToResult("(");
      g.appendToResult(2);
      g.operatorToResult("+");
      g.appendToResult(3);
      g.bracketToResult(")");
      g.operatorToResult("*");
      g.appendToResult(4);
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("20");
    });

    it("should handle decimal results", () => {
      g.appendToResult(1);
      g.operatorToResult("/");
      g.appendToResult(3);
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("0.3333333333");
    });

    it("should not calculate empty expression", () => {
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("");
    });

    it("should show Error for invalid expressions", () => {
      globalThis.currentExpression = "abc";
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("Error");
    });

    it("should show Error for division by zero", () => {
      g.appendToResult(5);
      g.operatorToResult("/");
      g.appendToResult(0);
      g.calculateResult();
      expect(globalThis.currentExpression).toBe("Error");
    });
  });

  describe("formatNumber", () => {
    it("should return integer as string", () => {
      expect(g.formatNumber(5)).toBe("5");
    });

    it("should round floating point numbers", () => {
      expect(g.formatNumber(0.1 + 0.2)).toBe("0.3");
    });

    it("should handle negative numbers", () => {
      expect(g.formatNumber(-5)).toBe("-5");
    });
  });

  describe("updateResult", () => {
    it("should display expression with × and ÷ symbols", () => {
      globalThis.currentExpression = "5*3";
      g.updateResult();
      expect(document.getElementById("result").value).toBe("5×3");
    });

    it("should display 0 for empty expression", () => {
      globalThis.currentExpression = "";
      g.updateResult();
      expect(document.getElementById("result").value).toBe("0");
    });

    it("should display Error", () => {
      globalThis.currentExpression = "Error";
      g.updateResult();
      expect(document.getElementById("result").value).toBe("Error");
    });
  });
});

describe("History", () => {
  let g;

  beforeEach(() => {
    setupDOM();
    loadScript();
    globalThis.currentExpression = "";
    globalThis.calculationHistory = [];
    localStorage.clear();
    vi.restoreAllMocks();
    g = getGlobals();
  });

  describe("saveToHistory", () => {
    it("should add item to history", () => {
      g.saveToHistory("2+3", "5");
      expect(globalThis.calculationHistory.length).toBe(1);
      expect(globalThis.calculationHistory[0].expression).toBe("2+3");
      expect(globalThis.calculationHistory[0].result).toBe("5");
    });

    it("should add newest items first", () => {
      g.saveToHistory("1+1", "2");
      g.saveToHistory("2+2", "4");
      expect(globalThis.calculationHistory[0].result).toBe("4");
      expect(globalThis.calculationHistory[1].result).toBe("2");
    });

    it("should limit history to MAX_HISTORY items", () => {
      for (let i = 0; i < 55; i++) {
        g.saveToHistory(`${i}+1`, `${i + 1}`);
      }
      expect(globalThis.calculationHistory.length).toBe(50);
    });

    it("should persist to localStorage", () => {
      g.saveToHistory("2+3", "5");
      const stored = JSON.parse(localStorage.getItem("vuna_calc_history"));
      expect(stored.length).toBe(1);
      expect(stored[0].result).toBe("5");
    });
  });

  describe("clearHistory", () => {
    it("should clear all history when confirmed", () => {
      g.saveToHistory("2+3", "5");
      vi.spyOn(window, "confirm").mockReturnValue(true);
      g.clearHistory();
      expect(globalThis.calculationHistory.length).toBe(0);
    });

    it("should not clear history when cancelled", () => {
      g.saveToHistory("2+3", "5");
      vi.spyOn(window, "confirm").mockReturnValue(false);
      g.clearHistory();
      expect(globalThis.calculationHistory.length).toBe(1);
    });

    it("should do nothing if history is empty", () => {
      const confirmSpy = vi.spyOn(window, "confirm");
      g.clearHistory();
      expect(confirmSpy).not.toHaveBeenCalled();
    });
  });

  describe("renderHistory", () => {
    it("should show empty message when no history", () => {
      g.renderHistory();
      const historyList = document.getElementById("history-list");
      expect(historyList.textContent).toContain("No calculations yet");
    });

    it("should render history items", () => {
      g.saveToHistory("2+3", "5");
      g.renderHistory();
      const historyList = document.getElementById("history-list");
      expect(historyList.textContent).toContain("2+3 = 5");
    });

    it("should disable clear button when empty", () => {
      g.renderHistory();
      const clearBtn = document.getElementById("clear-history-btn");
      expect(clearBtn.disabled).toBe(true);
    });

    it("should enable clear button when items exist", () => {
      g.saveToHistory("2+3", "5");
      g.renderHistory();
      const clearBtn = document.getElementById("clear-history-btn");
      expect(clearBtn.disabled).toBe(false);
    });
  });

  describe("loadFromHistory", () => {
    it("should load result into current expression", () => {
      g.saveToHistory("2+3", "5");
      g.loadFromHistory(0);
      expect(globalThis.currentExpression).toBe("5");
    });

    it("should do nothing for invalid index", () => {
      g.loadFromHistory(99);
      expect(globalThis.currentExpression).toBe("");
    });
  });

  describe("loadHistoryFromStorage", () => {
    it("should load history from localStorage", () => {
      const data = [{ expression: "1+1", result: "2", timestamp: new Date().toISOString() }];
      localStorage.setItem("vuna_calc_history", JSON.stringify(data));
      g.loadHistoryFromStorage();
      expect(globalThis.calculationHistory.length).toBe(1);
      expect(globalThis.calculationHistory[0].result).toBe("2");
    });

    it("should handle corrupted localStorage data", () => {
      localStorage.setItem("vuna_calc_history", "not json");
      g.loadHistoryFromStorage();
      expect(globalThis.calculationHistory).toEqual([]);
    });
  });
});
