import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[90px] justify-center',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        // team variants
        owner: 'text-white bg-blue-600 border-none',
        collaborator: 'text-white bg-black border-none',
        manager: 'text-white bg-[hsl(var(--chart-3))] border-none',
        active: 'text-white bg-[hsl(var(--chart-2))] border-none',
        invited: 'text-white bg-[hsl(var(--chart-4))] border-none',
        inactive: 'text-white bg-red-800 border-none',
        pending: 'text-white bg-stone-800 dark:border dark:border-input',
        // opportunities variants
        lead: 'text-white bg-stone-800 border-none',
        qual: 'text-white bg-stone-800 border-none',
        prop: 'text-white bg-stone-800 border-none',
        eval: 'text-white bg-stone-800 border-none',
        won: 'text-white bg-green-800 border-none',
        lost: 'text-white bg-red-800 border-none',
        activeProject: 'text-white bg-chart-2 border-chart-2',
        pausedProject: 'text-white bg-chart-3 border-chart-3',
        closedProject: 'text-white bg-black border-black',
        notification:
          'text-white bg-blue-600 border-none rounded-full min-w-[auto]',
        notificationTask:
          'text-white bg-blue-400 border-none rounded-full min-w-[auto]',
        noDataYet: 'text-white bg-red-400 border border-red-400'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
