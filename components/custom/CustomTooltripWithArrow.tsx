import { Button, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';

export const CustomTooltripWithArrow = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#3c4043',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#3c4043',
  },
}));
