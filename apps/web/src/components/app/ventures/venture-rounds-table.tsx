"use client"

import { DataTable } from "@/components/ui/data-table";
import { Round } from "@/lib/api";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ComponentPropsWithoutRef, FC } from "react"

export const columns: ColumnDef<Round>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "isAuctioned",
    header: "Is Auctioned",
  },
  {
    accessorKey: "maximumInvestmentPercentage",
    header: "Maximum Investment Percentage",
  },
  {
    accessorKey: "minimumInvestmentPercentage",
    header: "Minimum Investment Percentage",
  },
  {
    accessorKey: "offeredPercentage",
    header: "Offered Percentage",
  },
  {
    accessorKey: "ventureId",
    header: "Venture ID",
  },
  {
    accessorKey: "percentageValue",
    header: "Percentage Value",
  },
  {
    accessorKey: "percentageValueCurrency",
    header: "Percentage Value Currency",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      return format(new Date(row.original.startTime), "MM/dd/yyyy")
    }
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => {
      return format(new Date(row.original.endTime), "MM/dd/yyyy")
    }
  },
]

export interface VentureRoundsTableProps extends ComponentPropsWithoutRef<"div"> {
  rounds: Round[]
};

export const VentureRoundsTable: FC<VentureRoundsTableProps> = ({ rounds, ...props }) => {
  return (
    <div>
      <DataTable columns={columns} data={rounds} />
    </div>
  );
};