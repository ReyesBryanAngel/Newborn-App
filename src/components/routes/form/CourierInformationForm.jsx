import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Autocomplete, TextField, InputLabel, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ApiCall from '../../../auth/ApiCall';
import dayjs from "dayjs";
import CourierBranch from "../../../static/CourierBranch";
import InputField from '../../InputField';
import { useData } from '../../../context/DataProvider';

const CourierInformationForm = () => {
    const { userId } = useData();
    const navigate = useNavigate();
    const { http } = ApiCall();

    const formik = useFormik({
        initialValues: {
            courier: "",
            tracking_number: "",
            date_of_pickup: "",
            notes: "",
            result: "Sent"
        },
        validationSchema: yup.object({
            courier: yup.string().required('Courier is required'),
            tracking_number: yup.string().required('Tracking Number is required'),
            date_of_pickup: yup.date().typeError('Invalid Date').required('Date of Pickup is required'),
        }),
        onSubmit: (values)=>{
            saveCourierInformation(values);
        }
    })

    const saveCourierInformation = (values) => {
        const specimenDataWIthId =  { user_id: userId, ...values };
        http.post('/v1/specimens/courier-information', specimenDataWIthId)
        .then((res) => {
            if (res?.data?.status === 200) {
                const trackingNumber = res.data.tracking_number;
                navigate('/courier')
                sendSamples(trackingNumber);
            }
        })
        .catch((e) => {
            console.error(e.response?.data?.notes)
        });
    }

    const sendSamples = (trackingNumber) => {
        http.post('/v1/specimens/send-samples', { tracking_number: trackingNumber })
        .catch((e) => {
            console.error(e.response?.data?.notes)
        });
    }

    return (
        <div className='flex items-center justify-center mt-16 text-left'>
            <form onSubmit={formik.handleSubmit}>
                <Card elevation={4} className='px-10 py-10 lg:ml-64 mt-5 flex flex-col lg:px-28 md:px-20'>
                    <div className='mb-9'>
                        <div className='text-left'>
                            <Typography variant='h5'>Courier Information</Typography>
                            <div className='grid lg:grid-cols-3 lg:gap-10 mt-10'>
                                <div className='mb-9 mt-5 lg:mt-0'>
                                    <InputLabel htmlFor="name">
                                        <div >
                                                Courier
                                        </div>
                                    </InputLabel>
                                    <Autocomplete
                                        options={CourierBranch}
                                        getOptionLabel={(option) => option.label}
                                        value={CourierBranch.find((data) => data.value === formik?.values?.courier )}
                                        onChange={(event, value) => {
                                            formik?.setFieldValue("courier", value?.value)
                                        }}
                                        id="courier"
                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                variant='standard'
                                                name="courier"
                                                onBlur={formik.handleBlur}
                                                handleBlur={formik.handleChange}
                                                error={
                                                    formik.touched.courier &&
                                                    Boolean(formik.errors.courier)
                                                }
                                                helperText={
                                                    formik.touched.courier &&
                                                    (formik.errors.courier)
                                                }
                                            />
                                        )}
                                    />
                                </div>
                                <div className='mb-9 lg:mt-1'>
                                    <InputField
                                        title="Tracking Number"
                                        id="tracking_number"
                                        name="tracking_number"
                                        values={formik?.values?.tracking_number}
                                        handleChange={formik.handleChange}
                                        handleBlur={formik.handleBlur}
                                        error={
                                            formik.touched.tracking_number &&
                                            Boolean(formik.errors.tracking_number)
                                        }
                                        helperText={
                                            formik.touched.tracking_number &&
                                            (formik.errors.tracking_number)
                                        }
                                    />
                                </div>
                                <div className='mb-9'>
                                    <InputLabel htmlFor="name">
                                        <div >
                                                Date of Pickup
                                        </div>
                                    </InputLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimeField
                                            className='w-full'
                                            variant='standard'
                                            id='date_of_pickup'
                                            name='date_of_pickup'
                                            error= {formik.touched.date_of_pickup &&
                                            Boolean(formik.errors.date_of_pickup)}
                                            helperText= {formik.touched.date_of_pickup &&
                                            (formik.errors.date_of_pickup)}
                                            value={formik?.values?.date_of_pickup}
                                            onChange={(value) => {
                                                formik.setFieldValue("date_of_pickup", dayjs(value).format("YYYY-MM-DD HH:mm:ss"))
                                            }} 
                                            onBlur={formik.handleBlur}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className='mb-9'>
                                <TextField
                                    type='text'
                                    name='notes'
                                    className='w-full'
                                    label="Your notes..."
                                    id="notes"
                                    onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.notes}
                                        error={
                                            formik.touched.notes &&
                                            Boolean(formik.errors.notes)
                                        }
                                        helperText={
                                            formik.touched.notes &&
                                            (formik.errors.notes)
                                        } 
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-10 lg:gap-72 justify-center text-white'>
                        <div>
                            <Button
                                onClick={() => {
                                    navigate("/review-sample-form")
                                }}
                                sx={{
                                    color: "white",
                                    bgcolor:"#6DB3F2",
                                    padding: "10px",
                                    width:"90px",
                                    "&:hover": {
                                        bgcolor: "#6DB3F2",
                                    },
                                    textTransform: "none",
                                }}
                            >
                                Back
                            </Button>
                        </div>
                        <div>
                            <LoadingButton
                                loading={formik.isSubmitting}
                                type='submit'
                                size='medium'
                                sx={{ 
                                    color: "white",
                                    bgcolor:"#6DB3F2",
                                    padding: "10px",
                                    width:"90px",
                                    "&:hover": {
                                        bgcolor: "#6DB3F2",
                                    },
                                    textTransform: "none",
                                }}
                            >
                                Submit
                            </LoadingButton>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    )
}

export default CourierInformationForm;