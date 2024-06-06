import { theme } from "@/theme";
import styled from "@emotion/styled";
import {
  Box,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  stepConnectorClasses,
} from "@mui/material";
import React from "react";

type Props = {
  activeStep: number;
  completeStep: number;
};

const steps = [
  { step: 0, isComplete: true },
  { step: 1, isComplete: false },
  { step: 2, isComplete: false },
];

const QontoConnector = styled(StepConnector)(({}) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: "50%",
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[800],
    borderTopWidth: 1,
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  pr: 0,
  backgroundColor: theme.palette.grey[400],
  zIndex: 1,
  color: theme.palette.common.white,
  width: 16,
  height: 16,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    background: theme.palette.primary.main,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    background: theme.palette.primary.main,
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    ></ColorlibStepIconRoot>
  );
}

const StepperArea = ({ activeStep, completeStep }: Props) => {
  return (
    <Stepper
      sx={{
        width: 160,
      }}
      activeStep={activeStep}
      connector={<QontoConnector />}
    >
      {steps.map((stepData, index) => (
        <Step key={index} completed={index <= completeStep} className="p-0">
          <StepLabel
            sx={{ "& .MuiStepLabel-iconContainer": { p: 0 } }}
            StepIconComponent={ColorlibStepIcon}
          ></StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StepperArea;
