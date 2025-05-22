'use client';
import { fetchRecords } from '@/store/api/api';
import { useRecordStore } from '@/store/store';
import { ActionIcon, Alert, Box, Button, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { IconEdit, IconInfoCircle } from '@tabler/icons-react';
import FormulaInput from '@/components/formula-input';
export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['records'],
    queryFn: fetchRecords,
  });

  const {
    records,
    setRecords,
    formulas,
    addFormula,
    updateFormula,
  } = useRecordStore();

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
                  setValue={(tokens) => updateFormula(row.id, tokens)}
                />
              ) : (
                row.formula.map((t) =>
                  t.type === 'suggestion' ? t.metadata.name : t.value
                ).join(' ')
              ),
          },
          {
            accessor:"action",
            title:"",
            render: (row) => (
              <ActionIcon onClick={() => setEditingRowId(row.id)} variant="subtle" color="grey"><IconEdit/></ActionIcon>
            )
          }
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
