"use client";
import { fetchRecords } from "@/store/api/api";
import { useRecordStore } from "@/store/store";
import { Alert, Box, Button, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconInfoCircle } from "@tabler/icons-react";
import FormulaInput from "@/components/formula-input";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["records"],
    queryFn: fetchRecords,
  });

  const { records, setRecords } = useRecordStore();
  const [formulaTokens, setFormulaTokens] = useState<string[]>([]);

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
          Error While loading data please refetch
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
          { accessor: "name" },
          { accessor: "category" },
          { accessor: "value" },
          { accessor: "formula" },
        ]}
        records={formulas}
      />
      <Button className="mt-2">Add Variable</Button>
      <FormulaInput
        suggestions={records}
        value={formulaTokens}
        setValue={setFormulaTokens}
      />
    </Box>
  );
}

const formulas = [
  {
    id: uuidv4(),
    name: "Velocity",
    category: "v = d / t",
    value: "Distance = 100m, Time = 10s → v = 10 m/s",
    formula: "",
  },
  {
    id: uuidv4(),
    name: "Force",
    category: "F = m * a",
    value: "Mass = 5kg, Acceleration = 2m/s² → F = 10N",
    formula: "",
  },
  {
    id: uuidv4(),
    name: "Kinetic Energy",
    category: "KE = 0.5 * m * v²",
    value: "Mass = 2kg, Velocity = 3m/s → KE = 9J",
    formula: "",
  },
  {
    id: uuidv4(),
    name: "Pressure",
    category: "P = F / A",
    value: "Force = 100N, Area = 2m² → P = 50 Pa",
    formula: "",
  },
  {
    id: uuidv4(),
    name: "Ohm’s Law",
    category: "V = I * R",
    value: "Current = 2A, Resistance = 5Ω → V = 10V",
    formula: "",
  },
];
