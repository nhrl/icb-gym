import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center rounded-md border font-black text-3xl p-4 rounded-full border h-fit w-fit ",
  {
    variants: {
      variant: {
        default:
          "border-transparent border-zinc-800 bg-zinc-900  shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface tagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {}

function Tag({ className, variant, ...props }: tagProps) {
  return (
    <div className={cn(tagVariants({ variant }), className)} {...props} />
  )
}

export { Tag, tagVariants }
