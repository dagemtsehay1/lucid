'use client';
import { fetchRecords } from '@/store/api/api';
import { useRecordStore } from '@/store/store';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Loader,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { ReactNode, useEffect, useState } from 'react';
import { IconAlertTriangle, IconEdit, IconInfoCircle } from '@tabler/icons-react';
import FormulaInput from '@/components/formula-input';
import { Token } from '@/models/formula-input';
import { evaluateFormula } from '@/utils/utils';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['records'],
    queryFn: fetchRecords,
  });

  const { records, setRecords, formulas, addFormula, updateFormula } =
    useRecordStore();

  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  useEffect(() => {
    if (data) setRecords(data);
  }, [data, setRecords]);

  if (isLoading)
    return (
      <Box className="mt-50 flex justify-center">
        <Loader color="blue" />
      </Box>
    );

  if (error)
    return (
      <Box className="mt-50 flex justify-center">
        <Alert
          variant="light"
          color="red"
          title="Error"
          icon={<IconInfoCircle />}
          className="w-xl"
        >
          Error while loading data. Please retry.
        </Alert>
      </Box>
    );

  return (
    <Box className="w-[750px] mx-auto mt-10">
      <DataTable
        withTableBorder
        withColumnBorders
        striped
        highlightOnHover
        horizontalSpacing="xs"
        verticalSpacing="xs"
        columns={[
          { accessor: 'hasError',title:"",render: (row) => row.hasError ?     <Tooltip label="Your Formula has error" className='cursor-pointer'>
<IconAlertTriangle color="red" size="14" /></Tooltip> : ''},
          { accessor: 'name' },
          { accessor: 'category' },
          { accessor: 'value' },
          {
            accessor: 'formula',
            title: 'Formula',
            render: (row) =>
              editingRowId === row.id ? (
                <FormulaInput
                  suggestions={records}
                  value={row.formula}
                  setValue={(tokens) => updateFormula(row.id, tokens,row.hasError, row.value)}
                  onInactive={() => {
                    const { hasError, value } = evaluateFormula(row.formula);
                    console.log({hasError, value});
                    updateFormula(row.id, row.formula,hasError, value.toString());
                    setEditingRowId(null); 
                  }}
                />
              ) : (
                <UnstyledButton onDoubleClick={() => setEditingRowId(row.id)}>
                  {row.formula.length === 0 ? (
                    <Text color="gray" size="sm">
                      ƒ Enter Formula
                    </Text>
                  ) : (
                    <FormatedFormula formula={row.formula}/>
                  )}
                </UnstyledButton>
              ),
          },
          {
            accessor: 'action',
            title: '',
            render: (row) => (
              <ActionIcon
                onClick={() => setEditingRowId(row.id)}
                variant="subtle"
                color="grey"
                size="sm"
              >
                <IconEdit />
              </ActionIcon>
            ),
          },
        ]}
        records={formulas}
      />

      <Button
        className="mt-2"
        onClick={() => {
          addFormula();
        }}
      >
        Add Variable
      </Button>
    </Box>
  );
}


const FormatedFormula = ({ formula }:{formula:Token[]}) => {
  const components:ReactNode[] = [];
formula.map((t:Token) =>t.type === 'suggestion' ?components.push( <Badge variant="outline" color="gray">{t.metadata.name}</Badge>) :components.push(<Text span size='sm'>{t.value}</Text>))
  return (
    <div>
   { components.map((c) => c)}
    </div>
  );
};