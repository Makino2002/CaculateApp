const LOCAL_STORAGE_KEY = "calculatorHistory";

const CalculatorAPI = {
  getHistory: () => {
    const history = localStorage.getItem(LOCAL_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  },
  addHistory: (entry) => {
    const history = CalculatorAPI.getHistory();
    history.push(entry);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  },
  clearHistory: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
};

export default CalculatorAPI;
