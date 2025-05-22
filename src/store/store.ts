import { create } from 'zustand';
import { FormulaRow, Token } from '@/models/formula-input';
import { Record } from '@/models/record';



type State = {
  records: Record[];
  setRecords: (records: Record[]) => void;

  formulas: FormulaRow[];
  addFormula: () => void;
  updateFormula: (id: string, tokens: Token[], hasError: boolean, value: string) => void;
};

export const useRecordStore = create<State>((set, get) => ({
  records: [],
  setRecords: (records) => set({ records }),

  formulas: [],
  addFormula: () => {
    const { formulas } = get();

    const baseName = '# new variable';
    let name = baseName;
    let counter = 1;
    const existingNames = new Set(formulas.map(f => f.name));
    while (existingNames.has(name)) {
      name = `${baseName} ${counter++}`;
    }

    const baseCategory = 'category';
    let category = baseCategory;
    counter = 1;
    const existingCategories = new Set(formulas.map(f => f.category));
    while (existingCategories.has(category)) {
      category = `${baseCategory} ${counter++}`;
    }

    const newFormula: FormulaRow = {
      id: crypto.randomUUID(),
      name,
      category,
      value: '0',
      formula: [],
      hasError: false
    };

    set({ formulas: [...formulas, newFormula] });
  },

  updateFormula: (id, tokens, hasError, value) =>
    set((state) => ({
      formulas: state.formulas.map((f) =>
        f.id === id ? { ...f, formula: tokens,hasError:hasError,value:value } : f
      ),
    })),
}));
