export const useCurrency = () => {
  const parseCurrency = (value: string): number => {
    if (typeof value !== 'string' || !value) return 0;
    return Number(value.replace(/\./g, '').replace(',', '.'));
  };

  const formatBRL = (value: number): string => {
    if (isNaN(value)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função pura que formata uma string de input como moeda
  const formatInputAsCurrency = (value: string): string => {
    if (!value) return '';
    let numStr = value.replace(/\D/g, '');
    if (numStr === '') return '';
    
    numStr = (parseInt(numStr, 10) / 100).toFixed(2).toString();
    numStr = numStr.replace('.', ',');
    
    const parts = numStr.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  };

  return { parseCurrency, formatBRL, formatInputAsCurrency };
};