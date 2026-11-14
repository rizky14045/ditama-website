"use client";

import React, { useRef, useState } from "react";
import { uploadImageFile } from "@/lib/api-compro";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

interface ImageUploadDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  maxSizeMB?: number;
  aspectRatio?: "square" | "video" | "banner" | "auto";
  className?: string;
}

export default function ImageUploadDropzone({
  value,
  onChange,
  label = "Upload Gambar",
  helperText = "Format didukung: JPG, PNG, WEBP, SVG (Maks. 2MB)",
  maxSizeMB = 2,
  aspectRatio = "auto",
  className = "",
}: ImageUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;

    // Check size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Ukuran berkas melebihi batas maksimal ${maxSizeMB} MB.`);
      return;
    }

    // Check type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/x-icon"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|svg|ico)$/i)) {
      toast.error("Format file tidak didukung. Harap pilih gambar (JPG, PNG, WEBP, SVG, ICO).");
      return;
    }

    setIsUploading(true);
    const res = await uploadImageFile(file);
    setIsUploading(false);

    if (res.success && res.url) {
      onChange(res.url);
      toast.success("Gambar berhasil diunggah!");
    } else {
      toast.error(res.message || "Gagal mengunggah gambar ke server.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // reset input value so re-uploading same file name triggers change
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    toast.info("Gambar dihapus. Klik 'Simpan' untuk menerapkan perubahan.");
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square max-w-[200px]";
      case "video":
        return "aspect-video max-h-[220px]";
      case "banner":
        return "aspect-[21/9] max-h-[220px]";
      default:
        return "min-h-[160px]";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <Icon icon="lucide:image" className="w-4 h-4 text-amber-500" />
            {label}
          </label>
          {value && (
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Icon icon="lucide:check-circle-2" className="w-3 h-3" />
              Gambar Terpasang
            </span>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Preview Card */
        <div className="relative group rounded-xl border border-slate-200 bg-slate-50/70 p-3 overflow-hidden shadow-xs hover:border-slate-300 transition-all">
          <div className={`relative w-full ${getAspectClass()} rounded-lg bg-white border border-slate-200/80 overflow-hidden flex items-center justify-center`}>
            {/* Checkerboard pattern for transparent PNG / SVG */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
              }}
            />

            <img
              src={value}
              alt="Preview"
              className="max-h-full max-w-full object-contain p-2 z-10 transition-transform duration-200 group-hover:scale-105"
            />

            {/* Overlay Actions on Hover */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20 backdrop-blur-2xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-md hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Icon icon="lucide:refresh-cw" className="w-3.5 h-3.5 text-blue-600" />
                Ganti Gambar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="truncate max-w-[280px] font-mono text-[11px] text-slate-600">
              {value}
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer flex items-center gap-1"
            >
              <Icon icon="lucide:upload" className="w-3.5 h-3.5" />
              Upload Ulang
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone Box */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-amber-500 bg-amber-500/10 scale-[1.01]"
              : "border-slate-300 hover:border-amber-500/70 hover:bg-slate-50/80 bg-white"
          }`}
        >
          {isUploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2">
              <Icon icon="lucide:loader-2" className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-700">Mengunggah ke server...</p>
              <p className="text-xs text-slate-500">Memproses Magic Bytes & optimasi berkas</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                <Icon icon="lucide:cloud-upload" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  <span className="text-amber-600 hover:underline">Pilih file gambar</span> atau seret ke sini
                </p>
                <p className="text-xs text-slate-500 mt-1">{helperText}</p>
              </div>
              <span className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors">
                Browse File
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
