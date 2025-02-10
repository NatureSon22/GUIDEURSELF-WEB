import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GrNext, GrPrevious } from "react-icons/gr";
import PropTypes from "prop-types";
import { fuzzyFilter, dateBetweenFilterFn } from "@/utils/fuzzysort";

const DataTable = forwardRef(
  (
    {
      data,
      columns,
      filters = [],
      setFilters = () => {},
      globalFilter = "",
      setGlobalFilter = () => {},
      pageSize = 10,
      columnActions = {},
      rowSelection = {},
      setRowSelection = () => {},
      showFooter = true,
    },
    ref,
  ) => {
    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize,
    });

    // Memoized values
    const memoizedData = useMemo(() => data, [data]);
    const memoizedColumns = useMemo(
      () => columns(columnActions),
      [columnActions, columns],
    );

  const handlePageChange = (e) => {
    const page = Number(e.target.value) - 1;
    if (page >= 0 && page < table.getPageCount()) {
      table.setPageIndex(page);
    }
  };
   // Table instance
  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    filterFns: {
      fuzzy: fuzzyFilter,
      dateBetweenFilterFn,
    },
    state: {
      columnFilters: filters,
      globalFilter,
      pagination,
      rowSelection,
    },
    initialState: {
      columnVisibility: {
        full_name: false,
      },
    },
    enableRowSelection: true,
    getRowId: (row) => row._id,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

    // Expose filtered data to parent component
    useImperativeHandle(ref, () => ({
      getFilteredData: () => table.getFilteredRowModel().rows.map((row) => row.original),
    }));

    // Render table body
    const renderTableBody = () => {
      if (table.getRowModel().rows.length === 0) {
        return (
          <TableRow>
            <TableCell
              colSpan={memoizedColumns.length}
              className="py-4 text-center"
            >
              No matching data found.
            </TableCell>
          </TableRow>
        );
      }

      return table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ));
    };

    return (
      <div className="flex h-full flex-1 flex-col">
        <Table className="mt-3 flex-1 overflow-x-auto border-b border-t border-secondary-200-60">
          <TableHeader className="border-collapse bg-secondary-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`border text-base-300 ${
                      ["Action", "status"].includes(header.column.id)
                        ? "text-center"
                        : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>

        {/* Footer Section */}
        {showFooter && table.getRowModel().rows.length > 0 && (
          <div className="mb-0 mt-auto flex items-center justify-between pt-7">
            <p className="text-[0.9rem] font-semibold text-secondary-100-75">
              {`Showing ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()} ${
                table.getPageCount() > 1 ? "pages" : "page"
              }`}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="font-semibold text-secondary-100-75"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <GrPrevious />
                Previous
              </Button>

              <Input
                type="number"
                min="1"
                max={table.getPageCount()}
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = Number(e.target.value) - 1;
                  if (page >= 0 && page < table.getPageCount()) {
                    table.setPageIndex(page);
                  }
                }}
                className="w-16 rounded border p-1 text-center"
              />

              <Button
                variant="outline"
                className="font-semibold text-secondary-100-75"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
                <GrNext />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.func.isRequired,
  filters: PropTypes.array,
  setFilters: PropTypes.func,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
  pageSize: PropTypes.number,
  columnActions: PropTypes.object,
  rowSelection: PropTypes.object,
  setRowSelection: PropTypes.func,
  showFooter: PropTypes.bool,
};

export default DataTable;