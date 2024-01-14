import React from 'react';
import { InputLabel, TextField } from '@mui/material';

const InputField = ({ id, name, title, values, handleChange, handleBlur, error, helperText, disabled}) => {
    return (
        <div>
            <InputLabel htmlFor="name">
                <div className="text-sm">
                        {title}
                </div>
            </InputLabel>
            <TextField
                className="w-64 md:w-96 lg:w-full"
                id={id}
                name={name}
                variant="standard"
                type="text"
                value={values}
                onChange={handleChange}
                onBlur={handleBlur}
                error={error}
                helperText={helperText}
                disabled={disabled}
            />
        </div>
    )
}

export default InputField;