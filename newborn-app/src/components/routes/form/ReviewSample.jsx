import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Card, Typography, CardContent, Checkbox, Button, IconButton, CircularProgress, Box } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ApiCall from '../../../auth/ApiCall';
import { useData } from '../../../context/DataProvider';
import dayjs from 'dayjs';

const ReviewSample = () => {
    const navigate = useNavigate();
    const { http } = ApiCall();
    const { dispatch } = useData();
    const [specimenLoad, setSpecimenLoad] = useState(false);
    const [pendingSamples, setPendingSamples] = useState([]);

    const { data, isLoading } = useQuery({
        queryKey: ["specimen"],
        enabled: !specimenLoad,
        retryDelay: 500,
        refetchOnWindowFocus: false,
        queryFn: () =>
            http
                .get(`v1/specimens/all-samples`)
                .then((res) => {
                    setSpecimenLoad(true);
                    return res?.data;
                })
    })

    useEffect(() => {
        if (!isLoading && data) {
            const filteredSamples = data.filter(patient => patient.specimen_status === "Pending");
            setPendingSamples(filteredSamples);
            const initialCheckedList = filteredSamples.map((patient) => patient.checked);
            setIsCheckedList(initialCheckedList);
        }
    }, [data, isLoading]);

    const [isCheckedList, setIsCheckedList] = useState([]);
    const onCheckboxChange = (index) => {
      const newIsCheckedList = [...isCheckedList];
      newIsCheckedList[index] = !newIsCheckedList[index];
      setIsCheckedList(newIsCheckedList);
    }

    const logCourierInformation  = () => {
        const filteredData = pendingSamples.map((patient, index) => ({
            ...patient,
            checked: isCheckedList[index],
          }));

        http.post('/v1/specimens/update-checked', filteredData)
        .then((res) => {
            if (res?.data?.status === 200) {
            navigate("/courier-information-form")
            dispatch({ type: 'CATCH', payload: filteredData });
            }
        })
        .catch((e) => {
            console.error(e);
        });
    }
    
    const showRecords = data && !isLoading

    return (
        <div className='flex flex-col'>
            <div className='self-start lg:ml-20 mt-12'>
                <IconButton onClick={() => {
                    navigate("/courier")
                }}>
                    <div className='flex justify-center items-center rounded-full w-9 h-9 p-3 border-2 text-white bg-blue-300'>
                        <ArrowBackIcon />   
                    </div>
                </IconButton> 
            </div>
            <div className='flex items-center justify-center mt-5 lg:mt-0 lg:ml-36'>
                {showRecords ? (
                    <div className='flex flex-col gap-10'>
                        <div className='text-left'>
                            <Typography variant='h5'>Send Samples</Typography>
                        </div>
                        <div className='w-80 grid gap-10 md:grid-cols-2 md:w-full lg:grid-cols-3'>
                            {pendingSamples?.map((record, index) => {
                                const dateOfBirth = new Date(record?.date_and_time_of_birth);
                                const formattedDate = dayjs(dateOfBirth).format("YYYY-MM-DD");
                                const mother = `${record?.baby_last_name}, ${record?.mothers_first_name}`;
                                return (
                                <Card key={index} elevation={4}>
                                    <CardContent className='flex flex-col items-start lg:w-96'>
                                        <div className='flex items-center'>
                                            <Checkbox
                                                id={`checkbox-${index}`}
                                                checked={isCheckedList[index]}
                                                onChange={() => onCheckboxChange(index)}
                                            />
                                            <Typography variant='h6'>{mother}</Typography>
                                        </div>
                                        <div className='flex text-left mt-5 space-x-10 pl-5 lg:px-10 lg:space-x-10 lg:pl-5 whitespace-nowrap'>
                                            <div>
                                            <Typography>Birthday<br />{formattedDate}</Typography>
                                            </div>
                                            <div>
                                            <Typography>Sex<br />{record?.sex}</Typography>
                                            </div>
                                            <div>
                                            <Typography>Status<br />{record?.specimen_status}</Typography>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                );
                            })}
                    </div>
                    <div className='self-end flex text-white bg-blue-300'>
                        <Button
                            onClick={logCourierInformation}
                            size='medium'
                            sx={{ 
                                color: "white",
                                padding: "10px",
                                "&:hover": {
                                    bgcolor: "rgba(127, 177, 233, var(--tw-bg-opacity))",
                                },
                                textTransform: "none",
                            }}
                        >
                            Input Manul Courier Information
                        </Button>
                    </div>
                </div>
            ) :
            <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
            }
            </div>
        </div>
    )
}

export default ReviewSample;