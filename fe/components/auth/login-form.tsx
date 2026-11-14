"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useTransition } from "react";

const schema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(4, { message: "Kata sandi minimal 4 karakter." }),
});

interface LogInFormProps {
  logoUrl?: string;
  companyName?: string;
}

const LogInForm = ({ logoUrl, companyName = "PT. DITAMA INTI TEKNOLOGI" }: LogInFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [passwordType, setPasswordType] = useState("password");

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: { email: string; password: string }) => {
    startTransition(async () => {
      // 1. Fetch JWT token from Go Backend directly
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
        const tokenRes = await fetch(`${apiURL}/admin/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        const tokenData = await tokenRes.json();
        if (tokenData?.data?.token) {
          localStorage.setItem("ditama_admin_token", tokenData.data.token);
        }
      } catch (err) {
        console.warn("Could not pre-fetch JWT directly:", err);
      }

      // 2. Sign in with NextAuth
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.ok) {
        toast.success("Autentikasi Berhasil! Mengalihkan ke dashboard...");
        window.location.assign("/dashboard");
        reset();
      } else if (response?.error) {
        toast.error("Email atau password yang Anda masukkan salah.");
      }
    });
  };

  return (
    <div className="w-full py-8">
      {/* Brand Header with dynamic Logo from API */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-3.5 group">
          {logoUrl ? (
            <div className="h-12 px-3 py-1.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-center">
              <img
                src={logoUrl}
                alt={companyName}
                className="h-8 w-auto max-w-[180px] object-contain"
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-navy text-amberbrand font-bold flex items-center justify-center text-xl shadow-xs">
              D
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base text-navy tracking-tight">
              {companyName}
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Admin &amp; CMS Control Panel
            </span>
          </div>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl 2xl:text-3xl font-extrabold text-slate-900 tracking-tight">
          Masuk ke Portal Admin
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          Silakan masukkan kredensial akun terverifikasi Anda untuk mengakses sistem dashboard dan manajemen website.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-semibold text-xs uppercase tracking-wide text-slate-700">
            Email Administrator <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              {...register("email")}
              type="email"
              id="email"
              placeholder=""
              className={cn("h-12 rounded-xl bg-white border-slate-200 pl-10 font-medium text-slate-900 focus:border-navy", {
                "border-destructive": errors.email,
              })}
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          {errors.email && (
            <div className="text-destructive text-xs font-medium mt-1">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="font-semibold text-xs uppercase tracking-wide text-slate-700">
            Kata Sandi <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              {...register("password")}
              type={passwordType}
              id="password"
              placeholder=""
              className={cn("h-12 rounded-xl bg-white border-slate-200 pl-10 pr-11 font-medium text-slate-900 focus:border-navy", {
                "border-destructive": errors.password,
              })}
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Lock className="w-5 h-5" />
            </div>

            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-700 transition-colors p-1"
              onClick={togglePasswordType}
              tabIndex={-1}
              aria-label="Tampilkan atau sembunyikan kata sandi"
            >
              {passwordType === "password" ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="text-destructive text-xs font-medium mt-1">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 bg-navy hover:bg-navy-dark text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-amberbrand" />
                Memverifikasi Kredensial...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-amberbrand" />
                Masuk ke Panel Admin
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Security notice footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Akses Terenkripsi &amp; Khusus Staf Resmi PT. Ditama Inti Teknologi</span>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
