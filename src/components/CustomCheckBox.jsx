import {useEffect, useState} from 'react';
import { 
    FormControl,
    RadioGroup,
    Radio,
    FormControlLabel,
} from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";

const CustomCheckbox = ({ 
    name,
    checkBoxValue, 
    firstLabel,
    firstValue,
    secondLabel,
    secondValue,
    thirdLabel, 
    thirdValue,
    fourthLabel,
    fourthValue,
    handleBlur,
    handleChange,
    setFieldValue
}) => {
    const isLG = () => {
        return window.innerWidth >= 1024;
    }
    const [lg, setLg] = useState(isLG());
    useEffect(() => {
        const handleResize = () => setLg(isLG());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    return (
        <div>            
            <FormControl>
                <RadioGroup
                    name={name}
                    value={checkBoxValue}
                    onBlur={handleBlur}
                    onChange={(e) => {
                        const checkBoxValue = e?.target?.value;
                        handleChange(e)
                        if (name === "practitioner_profession" && checkBoxValue !== "other") {
                            setFieldValue("practitioner_profession_other", "")   
                        }
                    }}
                    row={lg}
                >
                <FormControlLabel
                    value={firstValue}
                    label={firstLabel}
                    control={<Radio icon={<CheckBoxOutlineBlank />} checkedIcon={<CheckBox />} />}
                />
                <FormControlLabel
                    value={secondValue}
                    label={secondLabel}
                    control={<Radio icon={<CheckBoxOutlineBlank />} checkedIcon={<CheckBox />} />}
                />
                {firstLabel !== "Initial Sample" && (
                    <FormControlLabel
                        value={thirdValue}
                        label={thirdLabel}
                        control={<Radio icon={<CheckBoxOutlineBlank />} checkedIcon={<CheckBox />} />}
                    />
                )}
                {firstLabel === "Doctor" &&(
                     <FormControlLabel
                        value={fourthValue}
                        label={fourthLabel}
                        control={<Radio icon={<CheckBoxOutlineBlank />} checkedIcon={<CheckBox />} />}
                    />
                )}

                </RadioGroup>
            </FormControl>
        </div>
    )
}

export default CustomCheckbox;