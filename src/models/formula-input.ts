import { Record } from "./record";

export type Token =
  | { value: number; type: 'number' }
  | { value: string; type: 'operator' }
  | {
      value: string;
      type: 'suggestion';
      metadata: Record;
    };

export interface FormulaInputProps {
  suggestions: Record[];
  value: Token[];
  setValue: (val: Token[]) => void;
}
