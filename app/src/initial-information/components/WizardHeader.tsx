import React from "react";
import { User, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardHeaderProps {
  currentStep: 1 | 2;
  totalSteps: number;
  onStepChange?: (step: 1 | 2) => void;
}

const WizardHeader: React.FC<WizardHeaderProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center">
          {[...Array(totalSteps)].map((_, index) => {
            const stepNumber = (index + 1) as 1 | 2;
            const isActive = stepNumber === currentStep;
            return (
              <div key={stepNumber} className="flex items-center">
                <div className={cn(
                  "flex flex-col items-center",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2",
                    isActive 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-muted border border-muted-foreground text-muted-foreground"
                  )}>
                    {stepNumber === 1 ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Home className="h-5 w-5" />
                    )}
                  </div>
                  <div className={cn(
                    "mt-2 text-sm font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {stepNumber === 1 ? "Información Personal" : "Información de Célula"}
                  </div>
                </div>
                {stepNumber < totalSteps && (
                  <div className="h-0.5 w-16 bg-muted mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-xl font-bold">
          {currentStep === 1 
            ? "Información Básica y Ministerial" 
            : "Información de Célula"}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {currentStep === 1
            ? "Complete su información personal y ministerial"
            : "Complete la información de su célula"}
        </p>
      </div>
    </div>
  );
};

export default WizardHeader;