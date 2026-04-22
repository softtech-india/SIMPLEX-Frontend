import React from "react";
import useIsMobile from "@/common/hooks/useIsMobile";

interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  value: number | string;
}

const SummaryCard: React.FC<SummaryCardProps> = React.memo(({ title, icon, value }) => {
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">{title}</span>
            {icon}
          </div>
          <p className="text-sm md:text-2xl font-bold text-gray-900">{value}</p>
        </div>
      )}

      {isMobile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 mr-1.5">{title}</span>
          <span className="text-sm font-bold text-gray-900">{value}</span>
        </div>
      )}
    </>
  );
});

export default SummaryCard;