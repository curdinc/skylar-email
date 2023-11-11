import type { HTMLProps } from "react";
import React, { useMemo, useState } from "react";
import type { ColumnDef, ExpandedState } from "@tanstack/react-table";
import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { EmailType } from "@skylar/client-db/schema/email";

type emailDisplayType = {
  email: string;
  emailLabel: { label: string; labelId: string; emails: EmailType[] }[];
};

const columnHelper = createColumnHelper<emailDisplayType>();
export const useFileExplorerTableInfo = () => {
  const columns = useMemo<ColumnDef<emailDisplayType, string>[]>(() => {
    return [
      columnHelper.accessor((row) => row.email, {
        id: "email",
        header: () => <>Emails</>,
        cell: ({ row, getValue }) => {
          let ExpanderToggle = (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? "👇" : "👉"}
            </button>
          );
          if (!row.getCanExpand()) {
            ExpanderToggle = <></>;
          }

          return (
            <div
              style={{
                // Since rows are flattened by default,
                // we can use the row.depth property
                // and paddingLeft to visually indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              <div>
                <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />{" "}
                {ExpanderToggle} {getValue()}
              </div>
            </div>
          );
        },
      }),
    ];
  }, []);

  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [data] = useState<emailDisplayType[]>(() => {
    return [
      {
        email: "curdCorp@gmail.com",
        emailLabel: [],
      },
    ];
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => {},
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });

  return { columns };
};

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
