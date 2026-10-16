import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement> & { striped?: boolean }>(
  ({ className, striped, ...props }, ref) => (
    <div className="w-full overflow-auto rounded-lg border border-border">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", striped && "table-striped", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b bg-slate-50/50 dark:bg-slate-800/50", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement> & { hoverable?: boolean }>(
  ({ className, hoverable = true, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors data-[state=selected]:bg-slate-100",
        hoverable && "hover:bg-slate-50 dark:hover:bg-slate-800/50",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
