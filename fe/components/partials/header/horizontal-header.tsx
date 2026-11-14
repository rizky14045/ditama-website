import { SiteLogo } from "@/components/svg";
import Link from "next/link";
const horizontalHeader = ({
  handleOpenSearch,
}: {
  handleOpenSearch: () => void;
}) => {
  return (
    <div className="flex items-center lg:gap-12 gap-3 ">
      <div>
        <Link
          href="/dashboard"
          className=" text-primary flex items-center gap-2"
        >
          <SiteLogo className="h-7 w-7" />
          <span className=" text-xl font-bold lg:inline-block hidden">
            PT. Ditama
          </span>
        </Link>
      </div>
    </div>
  );
};

export default horizontalHeader;
