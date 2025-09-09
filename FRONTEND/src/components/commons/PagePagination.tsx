import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export function PaginationCommon() {
  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <Button variant="outline" className="w-8 h-8 p-0 rounded-full cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Button variant="outline" className="w-8 h-8 p-0 rounded-full cursor-pointer">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}