"use client";
import { DataTable } from "mantine-datatable";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  return (
    <div className="container mx-auto mt-10">
      <DataTable
        withTableBorder
        withColumnBorders
        striped
        highlightOnHover
        horizontalSpacing="xs"
        verticalSpacing="xs"
        columns={[
          { accessor: "variable" },
          { accessor: "formula" },
          { accessor: "data" },
        ]}
        records={records}
      />
    </div>
  );
}

const records = [
  {
    id: uuidv4(),
    variable: "Velocity",
    formula: "v = d / t",
    data: "Distance = 100m, Time = 10s → v = 10 m/s",
  },
  {
    id: uuidv4(),
    variable: "Force",
    formula: "F = m * a",
    data: "Mass = 5kg, Acceleration = 2m/s² → F = 10N",
  },
  {
    id: uuidv4(),
    variable: "Kinetic Energy",
    formula: "KE = 0.5 * m * v²",
    data: "Mass = 2kg, Velocity = 3m/s → KE = 9J",
  },
  {
    id: uuidv4(),
    variable: "Pressure",
    formula: "P = F / A",
    data: "Force = 100N, Area = 2m² → P = 50 Pa",
  },
  {
    id: uuidv4(),
    variable: "Ohm’s Law",
    formula: "V = I * R",
    data: "Current = 2A, Resistance = 5Ω → V = 10V",
  },
];
