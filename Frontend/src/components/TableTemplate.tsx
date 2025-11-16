import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

interface Row {
  id: string;
  [key: string]: any;
}

interface TableTemplateProps {
  columns: Column[];
  rows: Row[];
  buttonHaver?: React.ComponentType<{ row: Row }>;
}

const TableTemplate: React.FC<TableTemplateProps> = ({ columns, rows, buttonHaver: ButtonHaver }) => {
  if (rows.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                    className={`font-semibold ${
                      column.align === 'center' ? 'text-center' :
                      column.align === 'right' ? 'text-right' :
                      'text-left'
                    }`}
                  >
                    {column.label}
                  </TableHead>
                ))}
                {ButtonHaver && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        className={
                          column.align === 'center' ? 'text-center' :
                          column.align === 'right' ? 'text-right' :
                          'text-left'
                        }
                      >
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  {ButtonHaver && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ButtonHaver row={row} />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableTemplate;
