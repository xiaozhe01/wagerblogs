"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

// Registry defaults swapped for project tokens (shadcn's greys are chroma-0)
// and for a height transition — its accordion-down/up keyframes don't exist.
function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col gap-2.5", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    // p-0: padding moves onto the trigger so the 44px touch target and the
    // visible row are one box; stacked they cost 76px a row.
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("card p-0 overflow-hidden", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 min-h-11 items-center justify-between gap-3 px-3 py-2 " +
            "text-left text-md font-semibold text-text-primary cursor-pointer outline-none " +
            "transition-colors duration-200 hover:text-brand active:text-brand " +
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          strokeWidth={2.5}
          aria-hidden="true"
          className="size-3 shrink-0 text-text-muted transition duration-300 group-aria-expanded/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden h-(--accordion-panel-height) transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn("px-3 pb-3 flex flex-col gap-2", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
