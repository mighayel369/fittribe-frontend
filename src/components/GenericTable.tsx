import React from "react";
import Loading from "./Loading";


type Column<T> = {
  header: React.ReactNode; 
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

type GenericTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  page: number;
  loading: boolean;
  emptyMessage?: string;
};

function GenericTable<T>({
  data,
  columns,
  page,
  loading,
  emptyMessage = "No records found.",
}: GenericTableProps<T>) {
  return (
    <table className="w-full table-fixed text-sm text-left text-gray-600">
      <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider border-b">
        <tr>
          <th className="py-3 px-4 w-16">ID</th>
          {columns.map((col, idx) => (
            <th 
              key={idx} 
              className={`py-3 px-4 ${col.headerClassName || col.className || ""}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length + 1} className="text-center py-12">
              <Loading message="Fetching data..." />
            </td>
          </tr>
        ) : data.length > 0 ? (
          data.map((row, index) => {
            return (
              <tr
                key={index}
                className="hover:bg-gray-50/80 transition-colors border-b border-gray-100"
              >
                <td className="py-4 px-4 text-gray-400 font-medium">
                  {(page - 1) * 5 + index + 1}
                </td>
                {columns.map((col, idx) => (
                  <td key={idx} className={`py-4 px-4 ${col.className || ""}`}>
                    {col.render
                      ? col.render(row)
                      : (row[col.accessor as keyof T] as React.ReactNode) ?? (
                          <span className="text-gray-300 italic">NA</span>
                        )}
                  </td>
                ))}
              </tr>
            );
          }) 
        ) : (
          <tr>
            <td
              colSpan={columns.length + 1}
              className="py-12 px-4 text-center text-gray-500 font-medium"
            >
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default GenericTable;