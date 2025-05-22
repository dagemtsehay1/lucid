import { Token } from "@/models/formula-input";

export const  evaluateFormula = (tokens: Token[]): { hasError: boolean; value: number }=> {
  try {
    const expr = tokens
      .map(token => {
        if (token.type === 'number') return token.value.toString();
        if (token.type === 'operator') return token.value;
        if (token.type === 'suggestion') {
          if (typeof token.metadata.value === 'number') {
            return token.metadata.value.toString();
          } else {
            return '0';
          }
        }
        return '';
      })
      .join(' ');
    const jsExpr = expr.replace(/\^/g, '**');
    if (!/^[0-9+\-*/().\s*^]+$/.test(jsExpr)) {
      return { hasError: true, value: 0 };
    }
    const result = Function(`"use strict"; return (${jsExpr})`)();

    if (typeof result !== 'number' || !isFinite(result)) {
      return { hasError: true, value: 0 };
    }

    return { hasError: false, value: result };
  } catch {
    return { hasError: true, value: 0 };
  }
}
