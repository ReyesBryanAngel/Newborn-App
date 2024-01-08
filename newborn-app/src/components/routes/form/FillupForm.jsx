import React from 'react';
import CustomCheckbox from '../../CustomCheckBox';
import { 
    Card,
    TextField, 
    InputLabel,
    MenuItem,
    Select,
    Button
} from "@mui/material";
import InputField from '../../InputField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { LoadingButton } from "@mui/lab";

const FillupForm = () => {
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
      setAge(event.target.value);
    };

    return (
        <div className='flex items-center justify-center mt-16 text-left'>
            <form>
                <Card elevation={4} className='px-10 py-10 lg:ml-52 mt-5 flex flex-col' >
                    <div className='mb-7'>
                        <InputLabel htmlFor="name">
                            <div >
                                    Type of Sample
                            </div>
                        </InputLabel>
                        <div className='flex flex-col lg:flex-row lg:gap-5'>
                            <CustomCheckbox
                                value={"Initial Sample"}
                                label={"Initial Sample"}
                            />
                            <CustomCheckbox
                                value={"Repeat Sample"}
                                label={"Repeat Sample"}
                            />
                        </div>
                    </div>
                    <div className='grid lg:grid-cols-3 lg:gap-10'>
                        <div className='mb-7'>
                            <InputField
                                title={<>Baby&apos;s Last Name</>}
                            />
                        </div>
                        <div className='mb-7'>
                                <InputField
                                    title={<>Baby&apos;s First Name</>}
                                />
                        </div>
                        <div className='mb-7'>
                            <InputLabel htmlFor="name">
                                <div >
                                    For Multiple Births
                                </div>
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                onChange={handleChange}
                                variant='standard'
                                className='w-full'
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className='grid lg:grid-cols-3 lg:gap-10'>
                        <div className='mb-7'>
                            <InputField
                                title={<>Mother&apos;s First Name</>}
                            />
                        </div>
                        <div className='mb-7'>
                            <InputLabel htmlFor="name">
                                <div >
                                        Date and Time of Birth
                                </div>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimeField
                                    className='w-full'
                                    variant='standard'
                                    // value={value}
                                    // onChange={(newValue) => setValue(newValue)}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mb-7'>
                        <InputLabel htmlFor="name">
                            <div >
                                    Sex
                            </div>
                        </InputLabel>
                        <div className='flex flex-col lg:flex-row'>
                            <CustomCheckbox
                                value={"M"}
                                label={"Male"}
                            />
                            <CustomCheckbox
                                value={"F"}
                                label={"Female"}
                            />
                            <CustomCheckbox
                                value={"A"}
                                label={"Ambiguous"}
                            />
                        </div>
                    </div>
                    <div className='grid lg:grid-cols-3 lg:gap-10'>
                        <div className='mb-7'>
                            <InputField
                                title={<>Baby&apos;s Weight (in Grams)</>}
                            />
                        </div>
                        <div className='mb-7'>
                            <InputLabel htmlFor="name">
                                <div >
                                        Date and Time of Collection
                                </div>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimeField
                                    className='w-full'
                                    variant='standard'
                                    // value={value}
                                    // onChange={(newValue) => setValue(newValue)}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className='mb-7'>
                            <InputField
                                title={<>Age of Gestation (in Weeks)</>}
                            />
                        </div>
                    </div>
                    <div className='mb-7'>
                        <InputLabel htmlFor="name">
                            <div >
                                    Specimen
                            </div>
                        </InputLabel>
                        <div className='flex flex-col lg:flex-row'>
                            <CustomCheckbox
                                value={"heel"}
                                label={"Heel"}
                            />
                            <CustomCheckbox
                                value={"cord"}
                                label={"Cord"}
                            />
                            <CustomCheckbox
                                value={"venous"}
                                label={"Venous"}
                            />
                        </div>
                    </div>
                    <div className='grid lg:grid-cols-3 lg:gap-10'>
                        <div className='mb-7'>
                            <InputField
                                title={"Hospital/Place of Collection"}
                            />
                        </div>
                        <div className='mb-7'>
                            <InputField
                                title={"Hospital/Place of Birth"}
                            />
                        </div>
                        <div className='mb-7'>
                            <InputField
                                title={<>Attending Practitioner (Last Name, First Name)</>}
                            />
                        </div>
                    </div>
                    <div className='mb-7'>
                        <InputLabel htmlFor="name">
                            <div >
                                    The Practitioner
                            </div>
                        </InputLabel>
                        <div className='flex flex-col lg:flex-row'>
                            <CustomCheckbox
                                value={"doctor"}
                                label={"Doctor"}
                            />
                            <CustomCheckbox
                                value={"nurse"}
                                label={"Nurse"}
                            />
                            <CustomCheckbox
                                value={"midwife"}
                                label={"Midwife"}
                            />
                            <div className='flex'>
                                <CustomCheckbox
                                    value={"other"}
                                    label={"Other:"}
                                />
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
                        </div>
                    </div>
                    <div className='grid lg:grid-cols-3 lg:gap-10'>
                        <div className='mb-7'>
                            <InputField
                                title={<>Practitioner&apos;s Mobile Number</>}
                            />
                        </div>
                        <div className='mb-7'>
                            <InputField
                                title={"Name of Parent/Gurdian"}
                            />
                        </div>
                        <div className='mb-7'>
                            <InputField
                                title={"Number and Street"}
                            />
                        </div>
                    </div>
                    <div className='grid lg:grid-cols-3 lg:gap-10'>
                        <div className='mb-7'>
                            <InputField
                                title={"Barangay/City"}
                            />
                        </div>
                        <div className='mb-7'>
                            <InputField
                                title={"Province"}
                            />
                        </div>
                        <div className='mb-7'>
                            <InputField
                                title={"Zipcode"}
                            />
                        </div>
                    </div>
                    <div className='grid mb-7 lg:grid-cols-3 lg:gap-10'>
                        <InputField
                            title={"Contact Number of Parent/Guardian"}
                        />
                    </div>
                    <div className='self-end'>
                        <LoadingButton type='submit' variant='contained'>
                            Submit
                        </LoadingButton>
                    </div>
                </Card>
            </form>
        </div>
    )
}

export default FillupForm;