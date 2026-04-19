import { useEffect, useRef } from "react";
import { MdSearch, MdFilterList } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import type { IssueFilters as FilterType } from "../../types";

interface IssueFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  totalItems: number;
}

const STATUS_OPTIONS = ["", "Open", "In Progress", "Resolved", "Closed"];
const PRIORITY_OPTIONS = ["", "Low", "Medium", "High", "Critical"];
const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest First" },
  { value: "updatedAt", label: "Last Updated" },
  { value: "priority", label: "By Priority" },
  { value: "status", label: "By Status" },
];

export const IssueFiltersBar = ({
  filters,
  onFilterChange,
  onExportCSV,
  onExportJSON,
  totalItems,
}: IssueFiltersProps) => {
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      onFilterChange({ ...filters, search: value, page: 1 });
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  const clearFilters = () => {
    onFilterChange({ page: 1, limit: filters.limit });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search issues by title or description..."
            defaultValue={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="
              w-full pl-9 pr-4 py-2.5 rounded-lg text-sm
              bg-secondary border border-border
              text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-brand-500
              focus:border-transparent transition-all
            "
          />
        </div>

        <select
          value={filters.status || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as FilterType["status"],
              page: 1,
            })
          }
          className="
            pl-3 pr-8 py-2.5 rounded-lg text-sm min-w-[130px]
            bg-secondary border border-border
            text-foreground focus:outline-none
            focus:ring-2 focus:ring-brand-500 transition-all
            cursor-pointer
          "
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s || "All Statuses"}
            </option>
          ))}
        </select>

        <select
          value={filters.priority || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              priority: e.target.value as FilterType["priority"],
              page: 1,
            })
          }
          className="
            px-3 py-2.5 rounded-lg text-sm min-w-[130px]
            bg-secondary border border-border
            text-foreground focus:outline-none
            focus:ring-2 focus:ring-brand-500 transition-all
            cursor-pointer
          "
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p || "All Priorities"}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy || "createdAt"}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              sortBy: e.target.value as FilterType["sortBy"],
            })
          }
          className="
            px-3 py-2.5 rounded-lg text-sm min-w-[140px]
            bg-secondary border border-border
            text-foreground focus:outline-none
            focus:ring-2 focus:ring-brand-500 transition-all
            cursor-pointer
          "
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MdFilterList size={14} />
                Filters active
              </span>
              <button
                onClick={clearFilters}
                className="
                  flex items-center gap-1 text-xs text-red-500
                  hover:text-red-400 transition-colors
                "
              >
                <IoClose size={14} />
                Clear all
              </button>
            </div>
          )}

          <span className="text-xs text-muted-foreground">
            {totalItems} issue{totalItems !== 1 ? "s" : ""} found
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="
              px-3 py-1.5 rounded-lg text-xs font-medium
              border border-border text-muted-foreground
              hover:text-foreground hover:bg-secondary
              transition-colors
            "
          >
            Export CSV
          </button>
          <button
            onClick={onExportJSON}
            className="
              px-3 py-1.5 rounded-lg text-xs font-medium
              border border-border text-muted-foreground
              hover:text-foreground hover:bg-secondary
              transition-colors
            "
          >
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};
