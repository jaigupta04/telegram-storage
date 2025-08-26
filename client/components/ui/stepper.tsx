"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Stepper = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const steps = React.Children.toArray(children)
    const [currentStep, setCurrentStep] = React.useState(0)

    const handleStep = (index) => {
      if (index >= 0 && index < steps.length) {
        setCurrentStep(index)
      }
    }

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          {steps.map((_, index) => (
            <React.Fragment key={index}>
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center font-semibold",
                  currentStep >= index
                    ? "bg-[#1898d5] text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
                onClick={() => handleStep(index)}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1",
                    currentStep > index
                      ? "bg-[#1898d5]"
                      : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="relative overflow-hidden">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {steps[currentStep]}
          </motion.div>
        </div>
      </div>
    )
  }
)
Stepper.displayName = "Stepper"

const Step = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("glass-card-enhanced p-8 rounded-2xl", className)}
      {...props}
    />
  )
})
Step.displayName = "Step"

export { Stepper, Step }
