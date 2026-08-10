"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye, ChevronRight, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useNavbar, useDeleteNavbar } from "../hooks/useNavbar";
import { Navbar } from "../types/navbar.type";
import NavbarAddModal from "./NavbarAddModal";
import NavbarEditModal from "./NavbarEditModal";
import NavbarViewModal from "./NavbarViewModal";

export default function NavbarManagement() {
  const [selectedNavbar, setSelectedNavbar] = useState<Navbar | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: response, isLoading, isError } = useNavbar();
  const { mutate: deleteNavbar } = useDeleteNavbar();

  // API returns single object in data. We map it to an array for the table.
  const rawData = response?.data;
  let navbars: Navbar[] = [];

  if (
    rawData &&
    response?.status !== false &&
    Object.keys(rawData).length > 0
  ) {
    navbars = Array.isArray(rawData) ? rawData : [rawData];
  }

  const handleView = (navbar: Navbar) => {
    setSelectedNavbar(navbar);
    setIsViewModalOpen(true);
  };

  const handleEdit = (navbar: Navbar) => {
    setSelectedNavbar(navbar);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteNavbar(id, {
      onSuccess: () => toast.success("Navbar logo deleted successfully"),
      onError: (error: any) => {
        const message = error.response?.data?.message || "Failed to delete navbar logo";
        toast.error(message);
      },
    });
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 font-medium">Error loading navbar data</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Logo Management
          </h1>
          <nav className="flex items-center text-sm text-gray-500 mt-1">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-900 font-medium">Logo Management</span>
          </nav>
        </div>
        <div className="w-full md:w-auto flex md:justify-end">
          {navbars.length === 0 && !isLoading && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#0057B8] hover:bg-[#004494] text-white font-semibold cursor-pointer shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Navbar Logo
            </Button>
          )}
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8F9FA]">
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="py-4 text-gray-600 font-bold text-center w-40 pl-8">
                  Logo
                </TableHead>
                <TableHead className="py-4 text-gray-600 font-bold text-center w-48">
                  Created At
                </TableHead>
                <TableHead className="py-4 text-gray-600 font-bold text-center pl-4 w-40">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={cn(isLoading && "opacity-50")}>
              {navbars.length > 0 ? (
                navbars.map((item: Navbar) => (
                  <TableRow
                    key={item._id}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-4 text-center pl-8">
                      <div className="relative w-24 h-12 mx-auto rounded overflow-hidden bg-gray-100 border border-gray-100 shadow-sm flex items-center justify-center transition-transform hover:scale-105">
                        {item.logo ? (
                          <Image
                            src={item.logo}
                            alt="Navbar Logo"
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center text-gray-500 text-sm font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 bg-blue-600 hover:bg-blue-600 rounded-full transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-16 text-center text-gray-400 font-medium italic bg-white"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="p-6 bg-white">
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6E4F5] bg-[#F8FBFF] px-6 py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                        <ImageIcon className="h-8 w-8 text-[#0057B8]" />
                      </div>
                      <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                        Data not found
                      </h2>
                      <p className="mt-2 max-w-md text-sm text-gray-500">
                        No logo data is available right now. Add a new logo to
                        show it here.
                      </p>
                      <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-6 bg-[#0057B8] hover:bg-[#004494] text-white font-semibold"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Logo
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <NavbarViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        navbar={selectedNavbar}
      />

      <NavbarEditModal
        key={selectedNavbar?._id || "edit-modal"}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedNavbar(null);
        }}
        navbar={selectedNavbar}
      />

      <NavbarAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
