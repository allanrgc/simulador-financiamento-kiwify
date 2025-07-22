export const useSimulation = () => {
  const calculateFinancing = (propertyValue: number, downPayment: number, term: number) => {
    const loanAmount = propertyValue - downPayment;
    const annualInterestRate = 0.12;
    const monthlyInterestRate = Math.pow(1 + annualInterestRate, 1 / 12) - 1;
    const n = term;

    if (loanAmount <= 0) {
      alert("O valor do financiamento deve ser positivo.");
      return null;
    }

    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, n)) / (Math.pow(1 + monthlyInterestRate, n) - 1);
    const totalPaid = monthlyPayment * n;
    const totalInterest = totalPaid - loanAmount;

    return {
      propertyValue,
      downPayment,
      loanAmount,
      term,
      monthlyPayment,
      totalPaid,
      totalInterest,
    };
  };

  return { calculateFinancing };
};