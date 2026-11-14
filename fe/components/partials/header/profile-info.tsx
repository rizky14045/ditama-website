"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const ProfileInfo = () => {
  const { data: session } = useSession();

  const handleLogout = () => {
    localStorage.removeItem("ditama_admin_token");
    sessionStorage.removeItem("ditama_admin_token");
    signOut({ callbackUrl: "/auth/login" });
  };

  const userName = session?.user?.name || "Super Administrator";
  const userEmail = session?.user?.email || "admin@ditama.co.id";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-default-100 transition">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={userName}
              width={34}
              height={34}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              <Icon icon="lucide:user" className="w-4 h-4" />
            </div>
          )}
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-default-900 leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-default-500 leading-tight">
              PT. Ditama Inti Teknologi
            </span>
          </div>
          <Icon icon="lucide:chevron-down" className="w-3.5 h-3.5 text-default-400 hidden md:block" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 p-1" align="end">
        <DropdownMenuLabel className="p-3 bg-default-50 dark:bg-default-100/50 rounded-md mb-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-default-900 truncate">
              {userName}
            </span>
            <span className="text-[11px] text-default-500 truncate">
              {userEmail}
            </span>
            <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary w-fit">
              Super Admin
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <Link href="/cms/settings">
            <DropdownMenuItem className="flex items-center gap-2.5 text-xs font-medium text-default-700 px-3 py-2 cursor-pointer">
              <Icon icon="lucide:settings" className="w-4 h-4 text-default-500" />
              Pengaturan &amp; Logo
            </DropdownMenuItem>
          </Link>
          <Link href="/" target="_blank">
            <DropdownMenuItem className="flex items-center gap-2.5 text-xs font-medium text-default-700 px-3 py-2 cursor-pointer">
              <Icon icon="lucide:external-link" className="w-4 h-4 text-default-500" />
              Lihat Website Compro
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onSelect={handleLogout}
          className="flex items-center gap-2.5 text-xs font-medium text-destructive px-3 py-2 cursor-pointer focus:bg-destructive/10 focus:text-destructive"
        >
          <Icon icon="lucide:log-out" className="w-4 h-4" />
          Keluar (Log Out)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileInfo;
