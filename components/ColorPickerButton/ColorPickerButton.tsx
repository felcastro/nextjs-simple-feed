import {
  IconButtonProps,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import React from "react";
import { ColorChangeHandler, SketchPicker } from "react-color";

export interface ColorPickerButtonProps extends IconButtonProps {
  color: string;
  onColorChange: ColorChangeHandler;
}

export const ColorPickerButton = ({
  icon,
  "aria-label": ariaLabel,
  color,
  onColorChange,
  ...props
}: ColorPickerButtonProps) => (
  <Popover>
    <PopoverTrigger>
      <IconButton
        icon={icon}
        aria-label={ariaLabel}
        size="sm"
        isRound
        colorScheme="brand"
        {...props}
      />
    </PopoverTrigger>
    <PopoverContent w="unset">
      <SketchPicker color={color} onChange={onColorChange} />
    </PopoverContent>
  </Popover>
);
