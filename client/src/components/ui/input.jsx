import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-navy/10 bg-white px-3.5 py-3 text-sm outline-none transition-shadow placeholder:text-slate-400 focus:border-azure focus:ring-[3px] focus:ring-azure/15",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
