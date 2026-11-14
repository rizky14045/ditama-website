import type { Metadata } from "next";

type TGetSeoMetaProps = Metadata | void;

export const getSeoMeta = (props: TGetSeoMetaProps): Metadata => {
  const {
    title,
    applicationName = "PT. Ditama Inti Teknologi",
    description = "General Supplier, IT Solution & System Integration",
    // manifest = "/assets/fav-icon/site.webmanifest",
    icons = {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/uploads/bb37bc4a-32f9-4b01-a764-028de1abf0a6.png",
    },
    ...restProps
  } = props || {};
  const finalTitle = title
    ? `${title} | PT. Ditama Inti Teknologi`
    : "PT. Ditama Inti Teknologi";

  return {
    title: finalTitle,
    applicationName,
    description,
    icons,
    // manifest,
    ...restProps,
  };
};
