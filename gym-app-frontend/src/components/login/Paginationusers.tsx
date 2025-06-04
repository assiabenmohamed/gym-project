import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  pageCount: number;
  currentPage: number;
  onPageChange: (newPage: number) => void; // Add onPageChange prop
};

export default function PaginationUsers({
  pageCount,
  currentPage,
  onPageChange,
}: Props) {
  console.log("pageCount", pageCount);

  // Handle click on page buttons
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pageCount) return; // Prevent invalid page numbers
    onPageChange(newPage);
  };

  return (
    <Pagination className="flex justify-end p-2 w-full hover:cursor-pointer">
      <PaginationContent>
        {/* Previous Page Button */}
        <PaginationItem>
          <PaginationPrevious
            className="hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(Math.max(currentPage - 1, 1)); // Go to previous page
            }}
          />
        </PaginationItem>

        {/* Next Page Button */}
        <PaginationItem>
          <PaginationNext
          className="hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(Math.min(currentPage + 1, pageCount)); // Go to next page
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
