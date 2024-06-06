import React, { useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import Accordion from "@mui/material/Accordion";
import { theme } from "@/theme";

type Props = {
  name: string;
  element?: React.ReactElement;
};
const CustomAccordion = ({ name, element }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <Accordion
        className="rounded-none text-grey-200 "
        sx={{
          background: "none",
          border: "1px solid #202124",
          "& .Mui-expanded": {
            background: theme.palette.grey[800],
            color: theme.palette.common.white,
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <AccordionSummary
          className="min-h-[0px] h-[50px]"
          expandIcon={<ExpandMoreIcon className="text-common-white" />}
        >
          <Typography className="text-grey-200 ">{name}</Typography>
        </AccordionSummary>

        <AccordionDetails className="bg-transparent">
          <Typography>
            <div className="flex-grow overflow-hidden">{element}</div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CustomAccordion;
