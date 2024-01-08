import React from 'react';
import { 
    InputLabel,
    FormControl,
    RadioGroup,
    Radio,
    FormControlLabel,
} from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";

const CustomCheckbox = ({ value, label }) => {
    return (
        <div>            
            <FormControl>
                <RadioGroup
                    row
                    name={name}
                    // value={value}
                    // onBlur={onBlur}
                    // onChange={handleCheckBoxChange}
                >
                <FormControlLabel
                    value={value}
                    label={label}
                    control={<Radio icon={<CheckBoxOutlineBlank />} checkedIcon={<CheckBox />} />}
                />
                </RadioGroup>
            </FormControl>
        </div>
    )
}

export default CustomCheckbox;