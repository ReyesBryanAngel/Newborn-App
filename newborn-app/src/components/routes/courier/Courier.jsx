import { useState } from 'react'
import ApiCall from '../../../auth/ApiCall';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import dayjs from 'dayjs';
import { 
    Card, 
    Typography, 
    CardContent, 
    Box, 
    CircularProgress, 
    IconButton, 
    Button,
    TextField, 
    InputAdornment
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Courier = () => {
    const navigate = useNavigate();
    const { http } = ApiCall();
    const [pendingSpecimens, setPendingSpecimens] = useState([]);
    const [sentSpecimens, setSentSpecimens] = useState([]);
    const [specimenLoad, setSpecimenLoad] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: allSamples, isLoading: allSampleLoading } = useQuery({
        queryKey: ["sample"],
        enabled: !specimenLoad,
        retryDelay: 500,
        refetchOnWindowFocus: false,
        queryFn: () =>
            http
                .get(`v1/specimens/all-samples`)
                .then((res) => {
                    setSpecimenLoad(true);

                    const pendingSamples = res?.data?.filter((patient) => patient.specimen_status === "Pending");
                    const sentSamples = res?.data?.filter((patient) => patient.specimen_status === "In Transit");
                    setPendingSpecimens(pendingSamples);
                    setSentSpecimens(sentSamples);
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

                    console.log(res?.data);
                    return res?.data;
                })
    })

    const showCourierSample = async (trackingNumber) => {
        try {
            const res = await http.get(`/v1/specimens/courier-sample/${trackingNumber}`);
            if (res?.data?.status === 200) {
                navigate("/courier-sample");
            }
        } catch (e) {
            console.error(e.response?.data?.message);
        }
    }

    const showRecords  = !allSampleLoading && allSamples && !courierLoading && couriers;
    const filteredCouriers = couriers?.filter((c) =>
        `${c.courier}-${c.tracking_number}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
    <div className='flex items-center justify-center mt-16 lg:ml-36'>
        {!couriers?.length > 0 && showRecords && (
            <div className='flex flex-col justify-center items-center mt-20'>       
                <div>
                    <Typography size='m' style={{ fontSize:"20px", fontWeight:"500" }}>You have no Courier Batches</Typography>
                    <Typography size='s'>Fill up a Specimen Form to add Patients to send via Courier.</Typography>
                </div>
                <div className='flex justify-center items-center p-3 text-white'>
                    <LocalShippingIcon sx={{ height:"300px", width:"300px", color:"#6DB3F2" }} />   
                </div>  
            </div>
        )}
        {showRecords ? (
          <div className='flex w-full flex-col'>
            <div className='text-left ml-5 lg:ml-0 m-5'>
              <Typography variant='h5'>Courier</Typography>
            </div>
            <div className='self-end'>
                <TextField
                label="Search Tracking Number"
                variant="standard"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='mb-3'
                InputProps={{
                    endAdornment: (
                    <InputAdornment>
                        <SearchIcon />
                    </InputAdornment>
                    
                    ),
                }}
                />
             </div>
            {pendingSpecimens?.length !== 0 &&(
                <div className='self-end ml-2 mt-10 flex text-white bg-blue-300'>
                    <Button
                        onClick={() => {
                            navigate("/review-sample-form");
                        }}
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
                        You have {pendingSpecimens?.length} unsent samples
                    </Button>
                </div>
            )}
            <div className='w-full grid gap-10 md:grid-cols-2 lg:grid-cols-3 mt-5'>
              {filteredCouriers?.map((c, index) => {
                const dateOfPickup = new Date(c.date_of_pickup);
                const formattedDate = dayjs(dateOfPickup).format("YYYY-MM-DD");
                const track = `${c.courier}-${c.tracking_number}`;
                const countMatchingSamples = (trackingNumber) => {
                    return sentSpecimens?.filter(sample => sample.tracking_number === trackingNumber).length;
                };
                const matchingSampleCount = countMatchingSamples(c.tracking_number);
                
                return (
                    <IconButton key={index} onClick={() => {showCourierSample(c.tracking_number)}}>
                        <Card elevation={4}>
                            <CardContent className='flex flex-col text-left'>
                                <Typography variant='h6'>{track}</Typography>
                                <div className='flex mt-5 space-x-8 pl-5 lg:space-x-9 lg:pl-0'>
                                    <div className='whitespace-nowrap'>
                                    <Typography>Date of Pickup<br />{formattedDate}</Typography>
                                    </div>
                                    <div>
                                    <Typography>Samples<br />{matchingSampleCount}</Typography>
                                    </div>
                                    <div>
                                    <Typography>Status<br />{c?.result}</Typography>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </IconButton>
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
    )
}

export default Courier;