import * as React from "react"
import { cn } from "@/lib/utils"

const ProgressIndeterminate = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <style>
      {`
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .progress-bar {
          animation: indeterminate 1s linear infinite;
        }
      `}
    </style>
    <div 
      className="absolute top-0 left-0 h-full w-2/4 bg-primary rounded-full progress-bar"
    />
  </div>
))
ProgressIndeterminate.displayName = "ProgressIndeterminate"

export { ProgressIndeterminate }