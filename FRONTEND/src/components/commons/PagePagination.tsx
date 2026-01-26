import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  total: number;
  limit: number;
  currentPage: number;
  onChangePage: (page: number) => void;
}

export function PaginationCommon({ total, limit, currentPage, onChangePage }: Props) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onChangePage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onChangePage(currentPage + 1);
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent className="gap-2">
        <PaginationItem>
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={handlePrev}
            className="w-8 h-8 p-0 rounded-full cursor-pointer disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <Button
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onChangePage(page)}
              className={`w-8 h-8 p-0 rounded-full cursor-pointer ${
                currentPage === page ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
            >
              {page}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={handleNext}
            className="w-8 h-8 p-0 rounded-full cursor-pointer disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}