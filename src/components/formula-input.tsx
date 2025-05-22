'use client';

import { useState, useRef } from 'react';
import {
  Combobox,
  useCombobox,
  InputBase,
  Pill,
  Text,
} from '@mantine/core';
import { FormulaInputProps } from '@/models/formula-input';

const operators = ['+', '-', '*', '/', '^', '(', ')'];

export default function FormulaInput({
  suggestions,
  value,
  setValue,
  onInactive, // <-- added onInactive prop
}: FormulaInputProps & { onInactive?: () => void }) {
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const combobox = useCombobox();
  const inputRef = useRef<HTMLInputElement>(null);

  const isNaturalNumber = (str: string) => /^[1-9][0-9]*$/.test(str);

  const addToken = (token: string) => {
    if (!token.trim()) return;

    const endsWithSpace = token.endsWith(' ');
    const trimmed = token.trim();

    const exactSuggestion = suggestions.find((s) => s.name === token);
    const suggestionStartsWithToken = suggestions.some((s) =>
      s.name.startsWith(token)
    );

    const isOperator = operators.includes(trimmed);
    const isNumber = isNaturalNumber(trimmed);

    if (exactSuggestion) {
      setValue([
        ...value,
        {
          value: exactSuggestion.name,
          type: 'suggestion',
          metadata: exactSuggestion,
        },
      ]);
      setSearch('');
      setError(null);
      combobox.closeDropdown();
    } else if (isOperator) {
      setValue([...value, { value: trimmed, type: 'operator' }]);
      setSearch('');
      setError(null);
      combobox.closeDropdown();
    } else if (isNumber) {
      setValue([...value, { value: parseInt(trimmed), type: 'number' }]);
      setSearch('');
      setError(null);
      combobox.closeDropdown();
    } else if (endsWithSpace && suggestionStartsWithToken) {
      // let user continue typing
      setError(null);
    } else {
      setError('Invalid value');
      combobox.openDropdown();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && search.trim() !== '') {
      event.preventDefault();
      addToken(search);
    } else if (event.key === 'Backspace' && search === '') {
      setValue(value.slice(0, -1));
    }
  };

  const filteredSuggestions = suggestions.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => addToken(val)}
    >
      <Combobox.Target>
        <InputBase
          component="div"
          onClick={() => {
            inputRef.current?.focus();
            combobox.openDropdown();
          }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            padding: '8px',
            border: `1px solid ${error ? 'red' : '#ced4da'}`,
            borderRadius: '4px',
          }}
        >
          {value.map((token, index) => (
            <Pill key={index}>
              {token.type === 'suggestion'
                ? token.metadata.name
                : token.value}
            </Pill>
          ))}
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setError(null);
              combobox.openDropdown();
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (typeof onInactive === 'function') {
                onInactive();
              }
            }}
            style={{
              flex: 1,
              minWidth: '120px',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
            }}
            placeholder={value.length === 0 ? "Type a formula and press Enter or Space" : ""}
          />
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        {error ? (
          <Text color="red" px="sm" py={4}>
            {error}
          </Text>
        ) : (
          <Combobox.Options>
            {filteredSuggestions.map((item) => (
              <Combobox.Option value={item.name} key={item.id}>
                {item.name}
              </Combobox.Option>
            ))}
            {operators
              .filter((op) => op.includes(search))
              .map((op) => (
                <Combobox.Option value={op} key={op}>
                  {op}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        )}
      </Combobox.Dropdown>
    </Combobox>
  );
}
