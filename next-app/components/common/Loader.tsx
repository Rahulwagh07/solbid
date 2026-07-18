import { LoaderCircle } from "lucide-react";
import React from "react";

function CustomLoader({ styles }: { styles?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-background/50 backdrop-blur-sm z-50 ${styles}`}
    >
      <div className="rounded-full p-3 bg-surface border border-border shadow-md">
        <LoaderCircle
          style={{ animation: "spin 0.7s linear infinite" }}
          className="h-5 w-5 text-accent"
        />
      </div>
    </div>
  );
}

export default CustomLoader;
