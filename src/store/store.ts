import { create } from 'zustand';
import { Token } from '@/models/formula-input';
import { Record } from '@/models/record';

type FormulaRow = {
  id: string;
  name: string;
  category: string;
  value: string;
  formula: Token[];
};

type State = {
  records: Record[];
  setRecords: (records: Record[]) => void;

  formulas: FormulaRow[];
  addFormula: () => void;
  updateFormula: (id: string, tokens: Token[]) => void;
};

export const useRecordStore = create<State>((set, get) => ({
  records: [],
  setRecords: (records) => set({ records }),

  formulas: [],
  addFormula: () => {
    const { formulas } = get();

    // Generate unique name like "# new variable", "# new variable 1", etc.
    const baseName = '# new variable';
    let name = baseName;
    let counter = 1;
    const existingNames = new Set(formulas.map(f => f.name));
    while (existingNames.has(name)) {
      name = `${baseName} ${counter++}`;
    }

    // Generate unique category like "category", "category 1", etc.
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
    };

    set({ formulas: [...formulas, newFormula] });
  },

  updateFormula: (id, tokens) =>
    set((state) => ({
      formulas: state.formulas.map((f) =>
        f.id === id ? { ...f, formula: tokens } : f
      ),
    })),
}));
