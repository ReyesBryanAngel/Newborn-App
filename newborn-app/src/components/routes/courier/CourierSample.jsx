import {useEffect, useState} from 'react';
import { useQuery } from "@tanstack/react-query";
import ApiCall from "../../../auth/ApiCall";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Card, Typography, CardContent, IconButton, CircularProgress, Box } from "@mui/material";
import dayjs from 'dayjs';

const CourierSample = () => {
    const navigate = useNavigate();
    const { http } = ApiCall();
    const [specimenLoad, setSpecimenLoad] = useState(false);
    const [filteredCourier, setFilteredCourier] = useState([]);
    const [dateOfPickup, setDateofPickup] = useState(null);

    const { data: refreshSamples, isLoading: refreshSampleLoading } = useQuery({
        queryKey: ["sample"],
        enabled: !specimenLoad,
        retryDelay: 500,
        refetchOnWindowFocus: false,
        queryFn: () =>
            http
                .get(`v1/specimens/refresh-samples`)
                .then((res) => {
                    setSpecimenLoad(true);
                    return res?.data;
                })
    })

    const { data: couriers, isLoading: courierLoading } = useQuery({
        queryKey: ["courier"],
        enabled: !specimenLoad,
        retryDelay: 500,
        refetchOnWindowFocus: false,
        queryFn: () =>
            http
                .get(`v1/specimens/show-couriers`)
                .then((res) => {
                    setSpecimenLoad(true);
                    return res?.data;
                })
    })

    useEffect(() => {
        if (!refreshSampleLoading && !courierLoading && couriers && refreshSamples) {
            const trackingNumber = refreshSamples?.samples?.map(t => t.tracking_number)[0];
            if (trackingNumber) {
                const countMatchingSamples = (trackingNumber) => {
                    return couriers.filter(courier => courier.tracking_number === trackingNumber);
                };
                const matchingTrackingNumber = countMatchingSamples(trackingNumber);
                const dop = matchingTrackingNumber[0]?.date_of_pickup;
                const convert = new Date(dop);
                const formattedDate = dayjs(convert).format("YYYY-MM-DD");
                setDateofPickup(formattedDate);
                setFilteredCourier(matchingTrackingNumber);
            }
        }
    },[refreshSampleLoading, courierLoading, couriers, refreshSamples])
    const showRecords  = !refreshSampleLoading && refreshSamples && !courierLoading && couriers
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
            <div className='flex items-center justify-center mt-5 lg:ml-36'>
                {showRecords ? (
                <div className='flex flex-col gap-10'>
                    <div className='text-left'>
                    {/* <Typography variant='h5'>Patients (by Mother&apos;s Name)</Typography> */}
                    {filteredCourier.map((c, index) => {
                            const courierTrackingNumber = `${c.courier}-${c.tracking_number}`;
                            return (
                                <div key={index} className='flex flex-col text-left lg:w-96'>
                                    <Typography variant='h6'>{courierTrackingNumber}</Typography>
                                    <div className='flex flex-col'>
                                        <div className='flex gap-10'>
                                            <div className='whitespace-nowrap'>
                                                <Typography>Date of Pickup<br />{dateOfPickup}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Samples<br />{refreshSamples?.samples?.length}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Status<br />{c.result}</Typography>
                                            </div>
                                        </div>
                                        <div className='mt-5'>
                                            <Typography>Notes<br />{c.notes}</Typography>
                                        </div>
                                    </div>
                                </div>
                            )
                    })}
                    </div>
                    <div className='w-full grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
                    {refreshSamples?.samples?.map((sample, index) => {
                        const dateOfBirth = new Date(sample.date_and_time_of_birth);
                        const formattedDate = dayjs(dateOfBirth).format("YYYY-MM-DD");
                        const mother = `${sample.baby_last_name}, ${sample.mothers_first_name}`;

                        return (
                        <Card key={index} elevation={4}>
                            <CardContent className='flex flex-col text-left lg:w-96'>
                            <Typography variant='h6'>{mother}</Typography>
                            <div className='flex mt-5 space-x-16 pl-5 lg:px-10 lg:space-x-10 lg:pl-5'>
                                <div className='whitespace-nowrap'>
                                <Typography>Birthday<br />{formattedDate}</Typography>
                                </div>
                                <div>
                                <Typography>Sex<br />{sample?.sex}</Typography>
                                </div>
                                <div>
                                <Typography>Status<br />{sample.specimen_status}</Typography>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        );
                    })}
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

export default CourierSample;