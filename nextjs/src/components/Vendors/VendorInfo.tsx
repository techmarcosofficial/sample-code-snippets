import React, { useEffect } from "react";
import { VendorInfoProps, OptionsProps } from "@/lib/types";
import { parseFilters } from "@/utils/helpers";

export default function VendorInfo({
  item
}: VendorInfoProps) {
  const [options, setOptions] = React.useState<OptionsProps[]>([]);
  useEffect(() => {
    if (item) {
      setOptions(parseFilters(item.options));
    }
  }, []);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6 border-b">
          <h6 className="text-blueGray-700 text-xl font-bold uppercase text-center">Vendor Snapshot</h6>
        </div>
        <div className="flex-auto px-4 py-6 pt-3">
          <div className="container mx-auto">
            <div className="flex flex-col">
              {options.map((option, i) => (
                <div key={i} className="px-4 py-4">
                  <h6 className="font-semibold uppercase mb-1">{option.name}</h6>
                  {option.items.map((item, index) => (
                    <div className="text-blueGray-500" key={index}>{item.name}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
