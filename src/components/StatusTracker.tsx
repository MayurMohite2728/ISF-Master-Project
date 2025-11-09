// StatusTracker.tsx
import React from "react";

interface Step {
  label: string;
  details?: string;
  timestamp?: string;
}

interface StatusTrackerProps {
  steps: Step[];
  overallStatus: "approved" | "pending" | "rejected";
  currentStepIndex?: number; // For pending/inProgress
  rejectedStepIndex?: number; // For rejected
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  steps,
  overallStatus,
  currentStepIndex = -1,
  rejectedStepIndex = -1,
}) => {
  // Function to determine circle color
  const getCircleColor = (index: number) => {
    if (overallStatus === "approved") return "bg-green-600";
    if (overallStatus === "pending") {
      return index <= currentStepIndex ? "bg-green-600" : "bg-gray-300";
    }
    if (overallStatus === "rejected") {
      if (index < rejectedStepIndex) return "bg-green-600";
      if (index === rejectedStepIndex) return "bg-red-600";
      return "bg-gray-300";
    }
    return "bg-gray-300";
  };

  // Function to determine line color
  const getLineColor = (index: number) => {
    if (overallStatus === "approved") return "bg-green-600";
    if (overallStatus === "pending") return index < currentStepIndex ? "bg-green-600" : "bg-gray-300";
    if (overallStatus === "rejected") return index < rejectedStepIndex ? "bg-green-600" : "bg-gray-300";
    return "bg-gray-300";
  };

  return (
    <div className="flex flex-col w-full mt-4">
      {/* Top row: circles + lines */}
      <div className="flex items-center w-full relative">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Circle */}
            <div
              className={`w-6 h-6 rounded-full z-10 ${getCircleColor(index)}`}
            />

            {/* Horizontal line */}
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 ${getLineColor(index)}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between w-full mt-2">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center">
            <div className="text-sm font-semibold">{step.label}</div>
            {step.details && <div className="text-xs text-gray-500">{step.details}</div>}
            {step.timestamp && <div className="text-xs text-gray-500">{step.timestamp}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
