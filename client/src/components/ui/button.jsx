import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/40 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        navy: "bg-navy text-white shadow-[0_10px_24px_rgba(15,23,42,.2)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,.28)]",
        // Brend yashiliga (emerald-500) oq matn 2.54:1 — WCAG AA (4.5:1) dan
        // o'tmaydi. Rangni saqlab, matnni navy qilamiz: 7.04:1. `text-navy`
        // EMAS — index.css uni dark rejimda oqartiradi; fon esa o'zgarmaydi.
        emerald:
          "bg-emerald-500 text-[#0f172a] shadow-[0_10px_22px_rgba(16,185,129,.35)] hover:-translate-y-0.5",
        outline:
          "border-[1.5px] border-navy/20 bg-transparent text-navy hover:border-navy hover:bg-navy/[.03]",
        // Qorong'i fonda emerald-700 3.12:1 — dark rejimda emerald-400 (8.9:1).
        "emerald-outline":
          "border-[1.5px] border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10",
        ghost: "text-navy hover:bg-navy/[.06]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        lg: "h-14 px-6 text-[15px]",
        sm: "h-9 px-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "navy", size: "default" },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
