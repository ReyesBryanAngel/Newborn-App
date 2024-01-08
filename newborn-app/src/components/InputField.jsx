import React from 'react';
import { InputLabel, TextField } from '@mui/material';

const InputField = ({ title }) => {
    return (
        <div>
            <InputLabel htmlFor="name">
                <div className="text-sm">
                        {title}
                </div>
            </InputLabel>
            <TextField
                className="w-full"
                id="name"
                name="name"
                variant="standard"
                type="text"
                // value={values?.name}
                // onChange={handleChange}
                // disabled={disabledForm}
                // onBlur={handleBlur}
                // {...errorAndHelperText(touched, errors, "name")}
            />
        </div>
    )
}

export default InputField;