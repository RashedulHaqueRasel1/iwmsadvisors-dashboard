"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { validateImage } from "@/lib/utils";
import { toPlainText } from "@/lib/plainText";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface CaseStudyAddModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (newCaseStudy: {
    title: string;
    subtitle?: string;
    description: string;
    challenge?: string;
    solution?: string;
    benefit?: string;
    customer?: string;
    imageFile?: File | null;
  }) => void;
}

type RichTextField = "customer" | "challenge" | "solution";

const richTextSections: {
  field: RichTextField;
  label: string;
  placeholder: string;
}[] = [
    {
      field: "customer",
      label: "Customer",
      placeholder: "Write customer details",
    },
    {
      field: "challenge",
      label: "Challenge",
      placeholder: "Describe the challenge",
    },
    {
      field: "solution",
      label: "Solution",
      placeholder: "Describe the solution",
    },
  ];

const emptyFormData = {
  title: "",
  subtitle: "",
  customer: "",
  challenge: "",
  solution: "",
};

const richTextModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const richTextFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

export default function CaseStudyAddModal({
  isOpen,
  onClose,
  onSave,
}: CaseStudyAddModalProps) {
  const [formData, setFormData] = useState(emptyFormData);
  const [benefitItems, setBenefitItems] = useState([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const resetForm = () => {
    setFormData(emptyFormData);
    setBenefitItems([""]);
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBenefitItemChange = (rowIndex: number, value: string) => {
    setBenefitItems((prev) =>
      prev.map((item, index) => (index === rowIndex ? value : item)),
    );
  };

  const handleAddBenefitItem = () => {
    setBenefitItems((prev) => [...prev, ""]);
  };

  const handleRemoveBenefitItem = (rowIndex: number) => {
    setBenefitItems((prev) => {
      const nextItems = prev.filter((_, index) => index !== rowIndex);
      return nextItems.length ? nextItems : [""];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resultImpact = benefitItems.map((item) => item.trim()).filter(Boolean).join("\n");

    onSave({
      title: formData.title,
      subtitle: formData.subtitle,
      customer: toPlainText(formData.customer),
      challenge: toPlainText(formData.challenge),
      solution: toPlainText(formData.solution),
      description: formData.subtitle || formData.title,
      benefit: resultImpact,
      imageFile,
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
        <DialogHeader className="px-8 py-6 border-b sticky top-0 bg-white z-10">
          <DialogTitle className="text-2xl font-bold text-[#1E293B]">
            Add Case Study
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold text-gray-700">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              className="w-full"
              placeholder="Enter case study title"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="subtitle"
              className="text-sm font-bold text-gray-700"
            >
              Subtitle
            </Label>
            <Input
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              className="w-full"
              placeholder="Enter case study subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Image</Label>
            <input
              ref={fileInputRef}
              id="case-study-image"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;

                if (file && !validateImage(file)) {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                  return;
                }

                setImageFile(file);
                if (imagePreview) URL.revokeObjectURL(imagePreview);
                setImagePreview(file ? URL.createObjectURL(file) : null);
              }}
            />

            <div className="flex flex-col items-center gap-4 text-center">
              <label
                htmlFor="case-study-image"
                className="relative group w-full max-w-[400px] h-48 mx-auto overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center p-4 cursor-pointer hover:bg-gray-100/50 transition-colors"
                aria-label="Choose Case Study Image"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Selected image preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <Plus className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center px-4">
                      Choose Image
                    </p>
                  </div>
                )}
              </label>

              {imagePreview && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-semibold text-[#0057B8] hover:bg-gray-50 hover:border-[#0057B8]/30 transition-all cursor-pointer group"
                  >
                    <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Change Image
                  </button>
                  <p className="text-xs text-gray-500">
                    Click to select a different image
                  </p>
                </div>
              )}
            </div>
          </div>

          {richTextSections.map((section) => (
            <div key={section.field} className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">
                {section.label} (Multi Text)
              </Label>
              <div className="overflow-hidden rounded-md border border-gray-200 bg-white [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[140px] [&_.ql-editor]:text-sm">
                <ReactQuill
                  theme="snow"
                  value={formData[section.field]}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      [section.field]: value,
                    }))
                  }
                  modules={richTextModules}
                  formats={richTextFormats}
                  placeholder={section.placeholder}
                />
              </div>
            </div>
          ))}

          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
            <Label className="text-sm font-bold text-gray-700">
              Benefits
            </Label>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-xs font-semibold text-gray-500">
                  Items
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddBenefitItem}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>

              {benefitItems.map((item, rowIndex) => (
                <div key={`benefit-item-${rowIndex}`} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleBenefitItemChange(rowIndex, e.target.value)
                    }
                    placeholder={`Benefit item ${rowIndex + 1}`}
                    className="w-full bg-white"
                  />
                  {benefitItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveBenefitItem(rowIndex)}
                      className="px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      aria-label={`Remove benefit item ${rowIndex + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-[#0057B8] hover:bg-[#004494]"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
