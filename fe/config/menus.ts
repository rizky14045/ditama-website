import {
  DashBoard,
  Graph,
  ClipBoard,
  Files,
  Sheild,
  Building2,
  Envelope,
  LucideIcon,
  Application,
  Components,
  Cart,
} from "@/components/svg";

export interface MenuItemProps {
  title: string;
  icon?: any;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
  isHeader?: boolean;
}

export const menusConfig: {
  mainNav: MenuItemProps[];
  sidebarNav: {
    modern: MenuItemProps[];
    classic: MenuItemProps[];
  };
} = {
  mainNav: [
    {
      title: "Dashboard",
      icon: DashBoard,
      href: "/dashboard",
    },
    {
      title: "CMS Compro",
      icon: Building2,
      child: [
        {
          title: "Pengaturan & SEO",
          href: "/cms/settings",
          icon: Files,
        },
        {
          title: "Banner Utama (Hero)",
          href: "/cms/hero",
          icon: ClipBoard,
        },
        {
          title: "Profil Perusahaan",
          href: "/cms/about",
          icon: Building2,
        },
        {
          title: "Layanan & Solusi",
          href: "/cms/services",
          icon: Application,
        },
        {
          title: "Kategori Solusi (Master)",
          href: "/cms/categories",
          icon: Components,
        },
        {
          title: "Portofolio Proyek",
          href: "/cms/portfolios",
          icon: Graph,
        },
        {
          title: "Klien & BUMN",
          href: "/cms/clients",
          icon: Building2,
        },
        {
          title: "Partner Teknologi",
          href: "/cms/partners",
          icon: Components,
        },
        {
          title: "Banner CTA (Bawah)",
          href: "/cms/cta",
          icon: ClipBoard,
        },
      ],
    },
    {
      title: "Pesan Masuk (Inquiries)",
      icon: Envelope,
      href: "/inquiries",
    },
    {
      title: "Audit & Keamanan",
      icon: Sheild,
      href: "/audit-logs",
    },
    {
      title: "Lihat Website",
      icon: LucideIcon,
      href: "/",
    },
  ],
  sidebarNav: {
    modern: [
      {
        title: "Dashboard",
        icon: DashBoard,
        child: [
          {
            title: "Ringkasan / Analytics",
            href: "/dashboard",
            icon: Graph,
          },
        ],
      },
      {
        title: "CMS Compro",
        icon: Building2,
        child: [
          {
            title: "Pengaturan & SEO",
            href: "/cms/settings",
            icon: Files,
          },
          {
            title: "Banner Hero",
            href: "/cms/hero",
            icon: ClipBoard,
          },
          {
            title: "Profil Perusahaan",
            href: "/cms/about",
            icon: Building2,
          },
          {
            title: "Layanan & Solusi",
            href: "/cms/services",
            icon: Application,
          },
          {
            title: "Kategori Solusi (Master)",
            href: "/cms/categories",
            icon: Components,
          },
          {
            title: "Portofolio Proyek",
            href: "/cms/portfolios",
            icon: Graph,
          },
          {
            title: "Klien & BUMN",
            href: "/cms/clients",
            icon: Building2,
          },
          {
            title: "Partner Teknologi",
            href: "/cms/partners",
            icon: Components,
          },
          {
            title: "Banner CTA (Bawah)",
            href: "/cms/cta",
            icon: ClipBoard,
          },
        ],
      },
      {
        title: "Pesan Masuk",
        icon: Envelope,
        child: [
          {
            title: "Konsultasi Masuk",
            href: "/inquiries",
            icon: Envelope,
          },
        ],
      },
      {
        title: "Sistem & Keamanan",
        icon: Sheild,
        child: [
          {
            title: "Audit Log Aktivitas",
            href: "/audit-logs",
            icon: Sheild,
          },
        ],
      },
      {
        title: "Website Publik",
        icon: LucideIcon,
        child: [
          {
            title: "Lihat Halaman Compro",
            href: "/",
            icon: LucideIcon,
          },
        ],
      },
    ],
    classic: [
      {
        isHeader: true,
        title: "Menu Utama",
      },
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        isHeader: true,
        title: "Manajemen Konten (CMS)",
      },
      {
        title: "Pengaturan & SEO",
        icon: Files,
        href: "/cms/settings",
      },
      {
        title: "Banner Utama (Hero)",
        icon: ClipBoard,
        href: "/cms/hero",
      },
      {
        title: "Profil Perusahaan",
        icon: Building2,
        href: "/cms/about",
      },
      {
        title: "Layanan & Solusi",
        icon: Application,
        href: "/cms/services",
      },
      {
        title: "Kategori Solusi (Master)",
        icon: Components,
        href: "/cms/categories",
      },
      {
        title: "Portofolio Proyek",
        icon: Graph,
        href: "/cms/portfolios",
      },
      {
        title: "Klien & BUMN",
        icon: Building2,
        href: "/cms/clients",
      },
      {
        title: "Partner Teknologi",
        icon: Components,
        href: "/cms/partners",
      },
      {
        title: "Banner CTA (Bawah)",
        icon: ClipBoard,
        href: "/cms/cta",
      },
      {
        isHeader: true,
        title: "Interaksi Pengunjung",
      },
      {
        title: "Pesan Masuk (Inquiries)",
        icon: Envelope,
        href: "/inquiries",
      },
      {
        isHeader: true,
        title: "Sistem & Keamanan",
      },
      {
        title: "Audit Log Aktivitas",
        icon: Sheild,
        href: "/audit-logs",
      },
      {
        isHeader: true,
        title: "Pratinjau",
      },
      {
        title: "Lihat Website Compro",
        icon: LucideIcon,
        href: "/",
      },
    ],
  },
};

export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
