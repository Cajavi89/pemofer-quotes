import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90 dark:hover:bg-gray-200',
        destructive:
          'bg-red-500 text-destructive-foreground shadow-sm hover:bg-red-600',
        outline: 'border border-input bg-background shadow-sm ',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-gray-400 hover:text-background',
        link: 'text-gray-800 dark:text-gray-200 underline-offset-4 hover:underline',
        blue: 'bg-blue-500 text-white shadow-sm hover:bg-blue-600 w-full',
        eyeBtn: '',
        calendarDay: 'hover:bg-gray-100 dark:hover:text-gray-600',
        outlineBlue:
          'border border-blue-500  text-blue-500 dark:border-blue-300 dark:text-blue-300 shadow-sm',
        viewSelected:
          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600',
        addTask:
          'bg-blue-500 text-white shadow-sm hover:bg-blue-600 w-fit py-1 px-1',
        sortFilter:
          'bg-transparent text-gray-600 dark:text-gray-400 w-fit hover:bg-transparent'
      },
      size: {
        default: 'h-8 px-3 text-xs',
        sm: 'h-7 rounded-md px-2.5 text-xs',
        lg: 'h-9 rounded-md px-6 text-sm',
        icon: 'h-8 w-8',
        sortFilter: 'h-fit w-fit p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
