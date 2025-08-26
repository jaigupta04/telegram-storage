"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "./button"

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, children, ...props }, ref) => {
    const steps = React.Children.toArray(children)
    const [currentStep, setCurrentStep] = React.useState(0)

    const handleStep = (index: number) => {
      if (index >= 0 && index < steps.length) {
        setCurrentStep(index)
      }
    }

    const handleNext = () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }

    const handlePrevious = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1)
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
        <div className="flex justify-between">
          <Button
            size="sm"
            variant="outline"
            className="glass-outline-enhanced px-8 py-4 text-sm text-white bg-transparent rounded-full w-full sm:w-auto"
            onClick={handlePrevious} 
            disabled={currentStep === 0}>
            Previous
          </Button>
          <Button 
            size="sm"
            variant="outline"
            className="glass-outline-enhanced px-8 py-4 text-sm text-white bg-transparent rounded-full w-full sm:w-auto"
            onClick={handleNext} 
            disabled={currentStep === steps.length - 1}>
            Next
          </Button>
        </div>
      </div>
    )
  }
)
Stepper.displayName = "Stepper"

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {}

const Step = React.forwardRef<HTMLDivElement, StepProps>(({ className, ...props }, ref) => {
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
