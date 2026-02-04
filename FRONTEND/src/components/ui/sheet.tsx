"use client"
import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  side?: "left" | "right" | "top" | "bottom"
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "left", className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 bg-white shadow-lg",
        side === "left" && "inset-y-0 left-0 w-80",
        side === "right" && "inset-y-0 right-0 w-80",
        side === "top" && "inset-x-0 top-0 h-1/3",
        side === "bottom" && "inset-x-0 bottom-0 h-1/3",
        className
      )}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
))
SheetContent.displayName = "SheetContent"

export { Sheet, SheetTrigger, SheetContent, SheetClose }
