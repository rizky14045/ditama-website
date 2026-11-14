import { Poppins } from "next/font/google";

export const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
  fallback: ["Poppins", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

export const fontHeading = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
  preload: false,
  fallback: ["Poppins", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

export const fontInter = fontPoppins;
export const fontJakarta = fontHeading;

export default fontPoppins;
