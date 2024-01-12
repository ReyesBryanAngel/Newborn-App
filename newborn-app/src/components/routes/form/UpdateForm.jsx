import { 
    Card,
    TextField, 
    InputLabel,
    Autocomplete,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Box
} from "@mui/material";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { UserFormik, specimenDataFetcher } from '../../FormikSetter';
import ApiCall from '../../../auth/ApiCall';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { LoadingButton } from "@mui/lab";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputField from '../../InputField';
import Feedings from "../../../static/Feedings";
import BabyStatus from '../../../static/BabyStatus';
import MultipleBirths from "../.././../static/MultipleBirths";
import dayjs from 'dayjs';
import { useData } from "../../../context/DataProvider";
import CustomCheckbox from '../../CustomCheckBox';

const UpdateForm = () => {
    const navigate = useNavigate();
    const { setFeedingValues } = useData();
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [specimenLoad, setSpecimenLoad] = useState(false);
    const [selectedFeedings, setSelectedFeedings] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const {http} = ApiCall();
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
                    setSelectedFeedings(specimenDataFetcher(res)?.samples?.feeding);
                    SpecimenForm.setValues(specimenDataFetcher(res)?.samples);
                    return res?.data;
                })
    });

    const onCheckboxChange = (index) => {
        const selectedFeeding = Feedings[index].value;
        if (selectedFeedings.includes(selectedFeeding)) {
          setSelectedFeedings(selectedFeedings.filter((feeding) => feeding !== selectedFeeding));
        } else {
          setSelectedFeedings([...selectedFeedings, selectedFeeding]);
        }
    
        setFeedingValues([...selectedFeedings, selectedFeeding]);
    };

    const closeSnackBar = () => {
        setOpenSnackBar(false);
    }

    const updateFeeding = async() => {
        http.put(`v1/specimens/update-feeding/${refreshSpecimen?.samples?.id}`, {feedings: selectedFeedings})
        .catch((e) => {
            console.error(e);
        });  
    }

    useEffect(()=>console.log(MultipleBirths.find((data) => data.value === SpecimenForm?.values?.for_multiple_births)?.value));

    const updateSpecimen = () => {
        http.put(`v1/specimens/${refreshSpecimen?.samples?.id}`, SpecimenForm?.values)
        .then((res) => {
            if (res?.data?.status === 200) {
                setSuccessMessage(res?.data?.message);
                updateFeeding();
                setTimeout(() => {
                    navigate("/records");
                }, 5000)
            }
        })
    }

    const showRecord = !refreshSpecimenLoading && refreshSpecimen;

    return (
        <div className='flex items-center justify-center mt-16 text-left'>
            {openSnackBar && (
                <Snackbar 
                    open={open} 
                    autoHideDuration={5000} 
                    onClose={closeSnackBar} 
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={closeSnackBar}
                        severity="success"
                    >
                    {successMessage}
                    </MuiAlert>
                </Snackbar>
            )}
            <form onSubmit={SpecimenForm.handleSubmit}>
                {showRecord && specimenLoad ? (
                    <Card elevation={4} className='px-10 py-10 lg:ml-64 mt-5 flex flex-col lg:px-28 md:px-20'>
                        <div className='mb-9'>
                            <InputLabel htmlFor="name">
                                <div >
                                        Type of Sample
                                </div>
                            </InputLabel>
                            <div className='flex flex-row lg:flex-row lg:gap-10'>
                                <div className='flex flex-col'>
                                    <CustomCheckbox
                                        name={"type_of_sample"}
                                        checkBoxValue={SpecimenForm.values.type_of_sample}
                                        firstLabel={"Initial Sample"}
                                        firstValue={"initial sample"}
                                        secondLabel={"Repeat Sample"}
                                        secondValue={"repeat sample"}
                                        handleBlur={SpecimenForm.handleBlur}
                                        handleChange={SpecimenForm.handleChange}
                                    />
                                    {SpecimenForm.touched.type_of_sample && SpecimenForm.errors.type_of_sample ? (
                                    <div className='text-red-600 text-sm'>{SpecimenForm.errors.type_of_sample}</div>
                                ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='grid lg:grid-cols-3 lg:gap-10'>
                            <div className='mb-9'>
                                <InputField
                                    title={<>Baby&apos;s Last Name</>}
                                    id="baby_last_name"
                                    name="baby_last_name"
                                    values={SpecimenForm?.values?.baby_last_name}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.baby_last_name &&
                                        Boolean(SpecimenForm.errors.baby_last_name)
                                    }
                                    helperText={
                                        SpecimenForm.touched.baby_last_name &&
                                        (SpecimenForm.errors.baby_last_name)
                                    }
                                />
                            </div>
                            <div className='mb-9'>
                                <InputField
                                    title={<>Baby&apos;s First Name</>}
                                    id="baby_first_name"
                                    name="baby_first_name"
                                    values={SpecimenForm?.values?.baby_first_name}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.baby_first_name &&
                                        Boolean(SpecimenForm.errors.baby_first_name)
                                    }
                                    helperText={
                                        SpecimenForm.touched.baby_first_name &&
                                        (SpecimenForm.errors.baby_first_name)
                                    }
                                />
                            </div>
                            <div className='mb-9'>
                                <InputLabel htmlFor="name">
                                    <div >
                                        For Multiple Births
                                    </div>
                                </InputLabel>
                                <Autocomplete
                                    options={MultipleBirths}
                                    getOptionLabel={(option) => option.value}
                                    value={MultipleBirths.find((data) => data.value === SpecimenForm?.values?.for_multiple_births)}
                                    onChange={(event, value) => {
                                        SpecimenForm?.setFieldValue("for_multiple_births", value?.value)
                                    }}
                                    id="for_multiple_births"
                                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            variant='standard'
                                            name="for_multiple_births"
                                            onBlur={SpecimenForm.handleBlur}
                                            handleBlur={SpecimenForm.handleChange}
                                            error={
                                                SpecimenForm.touched.for_multiple_births &&
                                                Boolean(SpecimenForm.errors.for_multiple_births)
                                            }
                                            helperText={
                                                SpecimenForm.touched.for_multiple_births &&
                                                (SpecimenForm.errors.for_multiple_births)
                                            }
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className='grid lg:grid-cols-3 lg:gap-10'>
                            <div className='mb-9'>
                                <InputField
                                    title={<>Mother&apos;s First Name</>}
                                    id="mothers_first_name"
                                    name="mothers_first_name"
                                    values={SpecimenForm?.values?.mothers_first_name}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.mothers_first_name &&
                                        Boolean(SpecimenForm.errors.mothers_first_name)
                                    }
                                    helperText={
                                        SpecimenForm.touched.mothers_first_name &&
                                        (SpecimenForm.errors.mothers_first_name)
                                    }
                                />
                            </div>
                            <div className='mb-9'>
                                <InputLabel htmlFor="name">
                                    <div >
                                            Date and Time of Birth
                                    </div>
                                </InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimeField
                                        className='w-full'
                                        variant='standard'
                                        id='date_and_time_of_birth'
                                        name='date_and_time_of_birth'
                                        error= {SpecimenForm.touched.date_and_time_of_birth &&
                                        Boolean(SpecimenForm.errors.date_and_time_of_birth)}
                                        helperText= {SpecimenForm.touched.date_and_time_of_birth &&
                                        (SpecimenForm.errors.date_and_time_of_birth)}
                                        value={dayjs(SpecimenForm?.values?.date_and_time_of_birth)}
                                        onChange={(value) => {
                                            SpecimenForm.setFieldValue("date_and_time_of_birth", dayjs(value).format("YYYY-MM-DD HH:mm:ss"))
                                        }} 
                                        onBlur={SpecimenForm.handleBlur}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div className='mb-9'>
                            <InputLabel htmlFor="name">
                                <div >
                                        Sex
                                </div>
                            </InputLabel>
                            <div className='flex flex-col lg:flex-row'>
                                <div className='flex flex-col'>
                                    <CustomCheckbox
                                        name={"sex"}
                                        checkBoxValue={SpecimenForm.values.sex}
                                        firstLabel={"Male"}
                                        firstValue={"M"}
                                        secondLabel={"Female"}
                                        secondValue={"F"}
                                        thirdLabel={"Ambiguous"}
                                        thirdValue={"A"}
                                        handleBlur={SpecimenForm.handleBlur}
                                        handleChange={SpecimenForm.handleChange}
                                    />
                                    {SpecimenForm.touched.sex && SpecimenForm.errors.sex ? (
                                        <div className='text-red-600 text-sm'>{SpecimenForm.errors.sex}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='grid lg:grid-cols-3 lg:gap-10'>
                            <div className='mb-9'>
                                <InputField
                                    title={<>Baby&apos;s Weight (in Grams)</>}
                                    id="babys_weight_in_grams"
                                    name="babys_weight_in_grams"
                                    values={SpecimenForm?.values?.babys_weight_in_grams}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.babys_weight_in_grams &&
                                        Boolean(SpecimenForm.errors.babys_weight_in_grams)
                                    }
                                    helperText={
                                        SpecimenForm.touched.babys_weight_in_grams &&
                                        (SpecimenForm.errors.babys_weight_in_grams)
                                    }
                                />
                            </div>
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
                                        value={dayjs(SpecimenForm?.values?.date_and_time_of_collection)}
                                        onChange={(value) => {
                                            SpecimenForm.setFieldValue("date_and_time_of_collection", dayjs(value).format("YYYY-MM-DD HH:mm:ss"))
                                        }} 
                                        onBlur={SpecimenForm.handleBlur}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className='mb-9'>
                                <InputField
                                    title="Age of Gestation in Weeks"
                                    id="age_of_gestation_in_weeks"
                                    name="age_of_gestation_in_weeks"
                                    values={SpecimenForm?.values?.age_of_gestation_in_weeks}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.age_of_gestation_in_weeks &&
                                        Boolean(SpecimenForm.errors.age_of_gestation_in_weeks)
                                    }
                                    helperText={
                                        SpecimenForm.touched.age_of_gestation_in_weeks &&
                                        (SpecimenForm.errors.age_of_gestation_in_weeks)
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
                        <div className='mb-10'>
                            <InputLabel htmlFor="name">
                                <div >
                                        Feedings
                                </div>
                            </InputLabel>
                            <div className='flex flex-col lg:flex-row lg:gap-5'>
                                {Feedings.map((feeding, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox
                                                id={`checkbox-${index}`}
                                                checked={selectedFeedings.includes(feeding.value)}
                                                onChange={() => onCheckboxChange(index)}
                                            />
                                        }
                                        label={feeding.label}
                                    />
                                ))}
                            </div>
                            {SpecimenForm.touched.type_of_sample && SpecimenForm.errors.feedings ? (
                                <div style={{ color:"#BD271E" }}>{SpecimenForm.errors.feedings}</div>
                            ) : null}
                        </div>
                        <div className='grid lg:grid-cols-3 lg:gap-10'>
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
                                    title={"Hospital/Place of Birth"}
                                    id="place_of_birth"
                                    name="place_of_birth"
                                    values={SpecimenForm?.values?.place_of_birth}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.place_of_birth &&
                                        Boolean(SpecimenForm.errors.place_of_birth)
                                    }
                                    helperText={
                                        SpecimenForm.touched.place_of_birth &&
                                        (SpecimenForm.errors.place_of_birth)
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
                            <div className='mb-9'>
                                <InputField
                                    title={"Number and Street"}
                                    id="number_and_street"
                                    name="number_and_street"
                                    values={SpecimenForm?.values?.number_and_street}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.number_and_street &&
                                        Boolean(SpecimenForm.errors.number_and_street)
                                    }
                                    helperText={
                                        SpecimenForm.touched.number_and_street &&
                                        (SpecimenForm.errors.number_and_street)
                                    }
                                />
                            </div>
                        </div>
                        <div className='grid lg:grid-cols-3 lg:gap-10'>
                            <div className='mb-9'>
                                <InputLabel htmlFor="name">
                                    <div >
                                            Baby Status
                                    </div>
                                </InputLabel>
                                <Autocomplete
                                    options={BabyStatus}
                                    getOptionLabel={(option) => option.value}
                                    value={BabyStatus.find((data) => data.value === SpecimenForm?.values?.baby_status)}
                                    onChange={(event, value) => {
                                        SpecimenForm?.setFieldValue("baby_status", value?.value)
                                    }}
                                    id="baby_status"
                                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            variant='standard'
                                            name="baby_status"
                                            onBlur={SpecimenForm.handleBlur}
                                            handleBlur={SpecimenForm.handleChange}
                                            error={
                                                SpecimenForm.touched.baby_status &&
                                                Boolean(SpecimenForm.errors.baby_status)
                                            }
                                            helperText={
                                                SpecimenForm.touched.baby_status &&
                                                (SpecimenForm.errors.baby_status)
                                            }
                                        />
                                    )}
                                />
                            </div>
                            <div className='mb-9'>
                                <InputField
                                    title={"Name of Parent/Gurdian"}
                                    id="name_of_parent"
                                    name="name_of_parent"
                                    values={SpecimenForm?.values?.name_of_parent}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.name_of_parent &&
                                        Boolean(SpecimenForm.errors.name_of_parent)
                                    }
                                    helperText={
                                        SpecimenForm.touched.name_of_parent &&
                                        (SpecimenForm.errors.name_of_parent)
                                    }
                                />
                            </div>
                            {[
                            "Date of Blood Transfusion",
                            "Combination of above, please state", 
                            "Other Relevant Clinical Information"
                            ].includes(SpecimenForm.values.baby_status) && (
                                <div className='mb-9'>
                                    <InputField
                                        title={<>Baby Status (Cont)</>}
                                        id="baby_status_cont"
                                        name="baby_status_cont"
                                        values={SpecimenForm?.values?.baby_status_cont}
                                        handleChange={SpecimenForm.handleChange}
                                        handleBlur={SpecimenForm.handleBlur}
                                        error={
                                            SpecimenForm.touched.baby_status_cont &&
                                            Boolean(SpecimenForm.errors.baby_status_cont)
                                        }
                                        helperText={
                                            SpecimenForm.touched.baby_status_cont &&
                                            (SpecimenForm.errors.baby_status_cont)
                                        }
                                    />
                                </div>
                            )}
                            <div className='mb-9'>
                                <InputField
                                    title={"Parent Contact Number"}
                                    id="contact_number_of_parent"
                                    name="contact_number_of_parent"
                                    values={SpecimenForm?.values?.contact_number_of_parent}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.contact_number_of_parent &&
                                        Boolean(SpecimenForm.errors.contact_number_of_parent)
                                    }
                                    helperText={
                                        SpecimenForm.touched.contact_number_of_parent &&
                                        (SpecimenForm.errors.contact_number_of_parent)
                                    }
                                />
                            </div>
                        </div>
                        <div className='grid lg:grid-cols-3 lg:gap-10'>
                            <div className='mb-9'>
                                <InputField
                                    title={"Barangay/City"}
                                    id="barangay_or_city"
                                    name="barangay_or_city"
                                    values={SpecimenForm?.values?.barangay_or_city}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.barangay_or_city &&
                                        Boolean(SpecimenForm.errors.barangay_or_city)
                                    }
                                    helperText={
                                        SpecimenForm.touched.barangay_or_city &&
                                        (SpecimenForm.errors.barangay_or_city)
                                    }
                                />
                            </div>
                            <div className='mb-9'>
                                <InputField
                                    title={"Province"}
                                    id="province"
                                    name="province"
                                    values={SpecimenForm?.values?.province}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.province &&
                                        Boolean(SpecimenForm.errors.province)
                                    }
                                    helperText={
                                        SpecimenForm.touched.province &&
                                        (SpecimenForm.errors.province)
                                    }
                                />
                            </div>
                            <div className='mb-9'>
                                <InputField
                                    title={"Zipcode"}
                                    id="zip_code"
                                    name="zip_code"
                                    values={SpecimenForm?.values?.zip_code}
                                    handleChange={SpecimenForm.handleChange}
                                    handleBlur={SpecimenForm.handleBlur}
                                    error={
                                        SpecimenForm.touched.zip_code &&
                                        Boolean(SpecimenForm.errors.zip_code)
                                    }
                                    helperText={
                                        SpecimenForm.touched.zip_code &&
                                        (SpecimenForm.errors.zip_code)
                                    }
                                />
                            </div>
                        </div>
                        <div className='grid mb-9 lg:grid-cols-2 lg:gap-10'>
                            <InputField
                                title={"Parent/Guardian Other Contact Number"}
                                id="additional_contact_number"
                                name="additional_contact_number"
                                values={SpecimenForm?.values?.additional_contact_number}
                                handleChange={SpecimenForm.handleChange}
                                handleBlur={SpecimenForm.handleBlur}
                                error={
                                    SpecimenForm.touched.additional_contact_number &&
                                    Boolean(SpecimenForm.errors.additional_contact_number)
                                }
                                helperText={
                                    SpecimenForm.touched.additional_contact_number &&
                                    (SpecimenForm.errors.additional_contact_number)
                                }
                            />
                        </div>
                        <div className='self-end'>
                            <LoadingButton loading={SpecimenForm.isSubmitting} type='submit' onClick={updateSpecimen} variant='contained'>
                                Submit
                            </LoadingButton>
                        </div>
                    </Card>
                ) :
                    <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                }
            </form>
        </div>
    )
}

export default UpdateForm;