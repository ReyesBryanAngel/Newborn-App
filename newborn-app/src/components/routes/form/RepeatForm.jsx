import { useState } from 'react';
import CustomCheckbox from '../../CustomCheckBox';
import { 
    Card,
    InputLabel,
    Box,
    CircularProgress
} from "@mui/material";
import InputField from '../../InputField';
import { useNavigate } from "react-router-dom";
import { UserFormik, specimenDataFetcher } from '../../FormikSetter';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { LoadingButton } from "@mui/lab";
import ApiCall from '../../../auth/ApiCall';
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";

const RepeatForm = () => {
    const navigate = useNavigate();
    const {http} = ApiCall();
    const [specimenLoad, setSpecimenLoad] = useState(false);
    const SpecimenForm = UserFormik();

    const { data: refreshSpecimen, isLoading: refreshSpecimenLoading } = useQuery({
        queryKey: ["sample"],
        enabled: !specimenLoad,
        retryDelay: 500,
        refetchOnWindowFocus: false,
        queryFn: () =>
            http
                .get(`v1/specimens/refresh-specimen`)
                .then((res) => {
                    setSpecimenLoad(true);
                    SpecimenForm.setValues(specimenDataFetcher(res))
                    return res?.data;
                })
    })

    const updateSpecimen = async() => {
        const {samples, ...updatedSpecimentData} = SpecimenForm.values;

        const newSpecimenData = {
            ...updatedSpecimentData,
            type_of_sample: 'Repeat Sample',
            specimen_status: refreshSpecimen?.samples?.specimen_status
          };

        http.put(`v1/specimens/${refreshSpecimen?.samples?.id}`, newSpecimenData)
        .then((res) => {
            if (res?.data?.status === 200) {
                navigate("/");
            }
        }).catch((e) => {
            console.error(e);
        })
    }

    const showRecord = !refreshSpecimenLoading && refreshSpecimen;

    return (
        <div className='flex items-center justify-center mt-16 text-left'>
            {showRecord ? (
                <form onSubmit={SpecimenForm.handleSubmit}>
                    <Card elevation={4} className='px-10 py-10 lg:ml-64 mt-5 flex flex-col lg:px-28 md:px-20'>
                        <div className='grid lg:grid-cols-2'>
                            <div className='mb-9'>
                                <InputLabel htmlFor="name">
                                    <div >
                                        Baby&apos;s Last Name
                                    </div>
                                </InputLabel>
                                {refreshSpecimen?.samples?.baby_last_name}
                            </div>
                            <div className='mb-9'>
                                <InputLabel htmlFor="name">
                                    <div >
                                        For Multiple Births
                                    </div>
                                </InputLabel>
                                {refreshSpecimen?.samples?.for_multiple_births}
                            </div>
                            <div className='mb-9'>
                                <InputLabel htmlFor="name">
                                    <div >
                                            Date and Time of Birth
                                    </div>
                                </InputLabel>
                                {refreshSpecimen?.samples?.date_and_time_of_birth}
                            </div>
                            <div className='mb-9'>
                                <InputLabel htmlFor="name">
                                    <div >
                                            Sex
                                    </div>
                                </InputLabel>
                                {refreshSpecimen?.samples?.sex}
                                <div className='flex flex-col lg:flex-row'>
                                    
                                </div>
                            </div>
                        </div>
                        <div className='grid lg:grid-cols-3 lg:gap-10'>
                            <div className='mb-9'>
                                <InputLabel htmlFor="name">
                                    <div >
                                            Date and Time of Collection
                                    </div>
                                </InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimeField
                                        className='w-full'
                                        variant='standard'
                                        id='date_and_time_of_collection'
                                        name='date_and_time_of_collection'
                                        error= {SpecimenForm.touched.date_and_time_of_collection &&
                                        Boolean(SpecimenForm.errors.date_and_time_of_birth)}
                                        helperText= {SpecimenForm.touched.date_and_time_of_collection &&
                                        (SpecimenForm.errors.date_and_time_of_collection)}
                                        value={SpecimenForm?.values?.date_and_time_of_collection}
                                        onChange={(value) => {
                                            SpecimenForm.setFieldValue("date_and_time_of_collection", dayjs(value).format("YYYY-MM-DD HH:mm:ss"))
                                        }} 
                                        onBlur={SpecimenForm.handleBlur}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className='mb-9'>
                                <InputField
                                    title={"Hospital/Place of Collection"}
                                    id="place_of_collection"
                                    name="place_of_collection"
                                    values={SpecimenForm?.values?.place_of_collection}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.place_of_collection &&
                                        Boolean(SpecimenForm.errors.place_of_collection)
                                    }
                                    helperText={
                                        SpecimenForm.touched.place_of_collection &&
                                        (SpecimenForm.errors.place_of_collection)
                                    }
                                />
                            </div>
                            <div className='mb-9'>
                                <InputField
                                    title={"Attending Practitioner"}
                                    id="attending_practitioner"
                                    name="attending_practitioner"
                                    values={SpecimenForm?.values?.attending_practitioner}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.attending_practitioner &&
                                        Boolean(SpecimenForm.errors.attending_practitioner)
                                    }
                                    helperText={
                                        SpecimenForm.touched.attending_practitioner &&
                                        (SpecimenForm.errors.attending_practitioner)
                                    }
                                />
                            </div>
                        </div>
                        <div className='grid lg:grid-cols-3 lg:gap-10'>
                            <div className='mb-9'>
                                <InputField
                                    title={<>Practitioner&apos;s Mobile Number</>}
                                    id="practitioners_mobile_number"
                                    name="practitioners_mobile_number"
                                    values={SpecimenForm?.values?.practitioners_mobile_number}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.practitioners_mobile_number &&
                                        Boolean(SpecimenForm.errors.practitioners_mobile_number)
                                    }
                                    helperText={
                                        SpecimenForm.touched.practitioners_mobile_number &&
                                        (SpecimenForm.errors.practitioners_mobile_number)
                                    }
                                />
                            </div>
                            <div className='mb-9'>
                                <InputField
                                    title={"Pract. Day Contact Number"}
                                    id="practitioners_day_contact_number"
                                    name="practitioners_day_contact_number"
                                    values={SpecimenForm?.values?.practitioners_day_contact_number}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.practitioners_day_contact_number &&
                                        Boolean(SpecimenForm.errors.practitioners_day_contact_number)
                                    }
                                    helperText={
                                        SpecimenForm.touched.practitioners_day_contact_number &&
                                        (SpecimenForm.errors.practitioners_day_contact_number)
                                    }
                                />
                            </div>
                        </div>
                        <div className='mb-9'>
                            <InputLabel htmlFor="name">
                                <div >
                                        Specimen
                                </div>
                            </InputLabel>
                            <div className='flex flex-col lg:flex-row'>
                                <div className='flex flex-col'>
                                    <CustomCheckbox
                                        name="specimens"
                                        checkBoxValue={SpecimenForm.values.specimens}
                                        firstLabel="Heel"
                                        firstValue="heel"
                                        secondLabel="Cord"
                                        secondValue="cord"
                                        thirdLabel="Venous"
                                        thirdValue="venous"
                                        handleBlur={SpecimenForm.handleBlur}
                                        handleChange={SpecimenForm.handleChange}
                                    />
                                    {SpecimenForm.touched.specimens && SpecimenForm.errors.specimens ? (
                                        <div className='text-red-600 text-sm'>{SpecimenForm.errors.specimens}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='mb-9'>
                            <InputLabel htmlFor="name">
                                <div >
                                        The Practitioner
                                </div>
                            </InputLabel>
                            <div className='flex flex-col lg:flex-row'>
                                <div className='flex flex-col'>
                                    <CustomCheckbox
                                        name={"practitioner_profession"}
                                        checkBoxValue={SpecimenForm.values.practitioner_profession}
                                        firstLabel="Doctor"
                                        firstValue="doctor"
                                        secondLabel="Nurse"
                                        secondValue="nurse"
                                        thirdLabel="Midwife"
                                        thirdValue="midwife"
                                        fourthLabel="Other:"
                                        fourthValue="other"
                                        handleBlur={SpecimenForm.handleBlur}
                                        handleChange={SpecimenForm.handleChange}
                                        setFieldValue={SpecimenForm.setFieldValue}
                                    />
                                    {SpecimenForm.touched.practitioner_profession && SpecimenForm.errors.practitioner_profession ? (
                                        <div className='text-red-600 text-sm'>{SpecimenForm.errors.practitioner_profession}</div>
                                    ) : null}
                                </div>
                                <div className='flex flex-col'>
                                    <div>
                                        <InputField
                                            title={null}
                                            id="practitioner_profession_other"
                                            name="practitioner_profession_other"
                                            values={SpecimenForm?.values?.practitioner_profession_other}
                                            handleChange={SpecimenForm.handleChange}
                                            handleBlur={SpecimenForm.handleBlur}
                                            disabled={SpecimenForm?.values?.practitioner_profession !== "other"}
                                        />
                                    </div>
                                    <div>
                                        {SpecimenForm.values.practitioner_profession === "other" &&  
                                            SpecimenForm?.touched?.practitioner_profession_other && (
                                        <div style={{ color:"#DC2626", fontSize:"12px" }}>{SpecimenForm.errors.practitioner_profession_other}</div>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className='self-end'>
                            <LoadingButton loading={SpecimenForm.isSubmitting} type='submit' onClick={updateSpecimen} variant='contained'>
                                Submit
                            </LoadingButton>
                        </div>
                    </Card>
                </form>
            ) : 
                <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            }
        </div>
    )
}

export default RepeatForm;