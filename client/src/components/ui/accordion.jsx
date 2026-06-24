import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "glass-card overflow-hidden rounded-2xl border border-navy/[.08] shadow-[0_2px_8px_rgba(15,23,42,.03)] transition-shadow data-[state=open]:shadow-[0_14px_34px_rgba(15,23,42,.1)]",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 px-5 py-5 text-left font-heading text-[17px] font-semibold text-navy",
          className
        )}
        {...props}
      >
        {children}
        <span className="relative flex h-5 w-5 flex-none items-center justify-center text-azure">
          <Plus className="h-5 w-5 group-data-[state=open]:hidden" />
          <Minus className="hidden h-5 w-5 group-data-[state=open]:block" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-[15px] leading-relaxed text-slate-600 data-[state=closed]:animate-[fadeOut_.2s] data-[state=open]:animate-[fadeIn_.2s]"
      {...props}
    >
      <div className={cn("px-5 pb-5", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
