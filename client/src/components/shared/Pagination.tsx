import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-1 ">
      <p className="text-xs text-muted-foreground just">
        Showing <span className="font-medium text-foreground">{startItem}</span>
        {" – "}
        <span className="font-medium text-foreground">{endItem}</span>
        {" of "}
        <span className="font-medium text-foreground">{totalItems}</span>
        {" issues"}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "p-1.5 rounded-lg border border-border text-muted-foreground",
              "hover:bg-secondary hover:text-foreground transition-colors",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            <MdChevronLeft size={18} />
          </button>

          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  "min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors",
                  currentPage === page
                    ? "bg-brand-500 text-white"
                    : "border border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "p-1.5 rounded-lg border border-border text-muted-foreground",
              "hover:bg-secondary hover:text-foreground transition-colors",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            <MdChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
