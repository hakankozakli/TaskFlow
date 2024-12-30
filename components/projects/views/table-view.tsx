'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { columns } from './table/columns';
import { dummyTableData } from '@/lib/dummy-data';

export function TableView() {
  return (
    <div className="border rounded-md h-full overflow-auto bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyTableData.map((project) => (
            <TableRow key={project.id}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey}>
                  {column.cell ? (
                    column.cell({ row: { getValue: () => project[column.accessorKey] } })
                  ) : (
                    project[column.accessorKey]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}