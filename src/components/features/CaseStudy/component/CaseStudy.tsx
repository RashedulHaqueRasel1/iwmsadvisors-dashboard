"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";
import {
  useCaseStudies,
  useUpdateCaseStudy,
  useDeleteCaseStudy,
} from "../hooks/casestudy";
import { CaseStudy as CaseStudyType } from "../types/casestudy.types";
import { cn } from "@/lib/utils";
import CaseStudyViewModal from "./CaseStudyViewModal";
import CaseStudyEditModal from "./CaseStudyEditModal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CaseStudyAddModal from "./CaseStudyAddModal";
import { useCreateCaseStudy } from "../hooks/casestudy";
import { toPlainText } from "@/lib/plainText";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message || fallback;
  }

  return fallback;
};

export default function CaseStudy() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCaseStudy, setSelectedCaseStudy] =
    useState<CaseStudyType | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: response, isLoading, isError } = useCaseStudies();
  const { mutate: updateCaseStudy } = useUpdateCaseStudy();
  const { mutate: deleteCaseStudy } = useDeleteCaseStudy();
  const { mutate: createCaseStudy } = useCreateCaseStudy();

  const caseStudies = response?.data || [];
  const pagination = response?.pagination;

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (!pagination) return [];
    const totalPages = pagination.totalPages;
    const pages = [];

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handleView = (caseStudy: CaseStudyType) => {
    setSelectedCaseStudy(caseStudy);
    setIsViewModalOpen(true);
  };

  const handleEdit = (caseStudy: CaseStudyType) => {
    setSelectedCaseStudy(caseStudy);
    setIsEditModalOpen(true);
  };

  const handleSave = (
    updatedData: Partial<CaseStudyType> & { imageFile?: File },
  ) => {
    if (selectedCaseStudy) {
      updateCaseStudy(
        { id: selectedCaseStudy._id, data: updatedData },
        {
          onSuccess: () => {
            toast.success("Case study updated successfully");
            setIsEditModalOpen(false);
          },
          onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update case study"));
          },
        },
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteCaseStudy(id, {
      onSuccess: () => {
        toast.success("Case study deleted successfully");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Failed to delete case study"));
      },
    });
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleCreate = (newData: {
    title: string;
    subtitle?: string;
    description: string;
    challenge?: string;
    solution?: string;
    benefit?: string;
    customer?: string;
    imageFile?: File | null;
  }) => {
    createCaseStudy(
      newData as unknown as Omit<
        CaseStudyType,
        "_id" | "createdAt" | "updatedAt" | "__v"
      >,
      {
        onSuccess: () => {
          toast.success("Case study added successfully");
          setIsAddModalOpen(false);
        },
        onError: (error: unknown) => {
          toast.error(getErrorMessage(error, "Failed to add case study"));
        },
      },
    );
  };

  if (isError || (response && !response.success)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
        <p className="text-red-500 font-medium">Error loading case studies</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Case Study Management
          </h1>
          <nav className="flex items-center text-sm text-gray-500 mt-1">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-900 font-medium">
              Case Study Management
            </span>
          </nav>
        </div>
        <div className="w-full md:w-auto flex md:justify-end">
          <Button
            onClick={handleAddNew}
            className="bg-[#0057B8] hover:bg-[#004494] text-white font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Case Study
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8F9FA]">
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="py-4 text-gray-600 font-bold text-center">
                  Title
                </TableHead>
                <TableHead className="py-4 text-gray-600 font-bold text-center">
                  Subtitle
                </TableHead>
                {/* <TableHead className="py-4 text-gray-600 font-bold text-center">
                  Customer
                </TableHead> */}
                <TableHead className="py-4 text-gray-600 font-bold text-center">
                  Created
                </TableHead>
                <TableHead className="py-4 text-gray-600 font-bold text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={cn(isLoading && "opacity-50")}>
              {caseStudies.length > 0 ? (
                caseStudies.map((caseStudy: CaseStudyType) => (
                  <TableRow
                    key={caseStudy._id}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-4 text-center text-gray-700 font-medium">
                      {caseStudy.title}
                    </TableCell>
                    <TableCell className="py-4 text-center text-gray-600">
                      {caseStudy.subtitle || "N/A"}
                    </TableCell>
                    {/* <TableCell className="py-4 text-center text-gray-600">
                      {toPlainText(caseStudy.customer).replace(/\n/g, " ") || "N/A"}
                    </TableCell> */}
                    <TableCell className="py-4 text-center text-gray-600">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(caseStudy.createdAt))}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <button
                        onClick={() => handleView(caseStudy)}
                        className="p-2 bg-blue-600 hover:bg-blue-600 rounded-full transition-colors cursor-pointer"
                      >
                        <Eye className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={() => handleEdit(caseStudy)}
                        className="p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors cursor-pointer ml-2"
                      >
                        <Edit className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(caseStudy._id)}
                        className="p-2 bg-red-600 hover:bg-red-600 rounded-full transition-colors cursor-pointer ml-2"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-gray-400"
                  >
                    No case studies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {pagination && (
          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4 border-t">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg hover:bg-gray-50 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..."}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-lg font-medium transition-colors",
                    page === currentPage
                      ? "bg-[#0057B8] text-white"
                      : page === "..."
                        ? "text-gray-400 cursor-default"
                        : "border hover:bg-gray-50 text-gray-500 cursor-pointer",
                  )}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="p-2 border rounded-lg hover:bg-gray-50 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </Card>

      <CaseStudyViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        caseStudy={selectedCaseStudy}
      />

      <CaseStudyEditModal
        key={
          selectedCaseStudy?._id
            ? `edit-${selectedCaseStudy._id}-${isEditModalOpen ? "open" : "closed"}`
            : "edit-modal"
        }
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        caseStudy={selectedCaseStudy}
        onSave={handleSave}
      />
      <CaseStudyAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreate}
      />
    </div>
  );
}
