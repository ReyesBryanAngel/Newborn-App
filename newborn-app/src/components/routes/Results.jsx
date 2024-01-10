import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import ApiCall from '../../auth/ApiCall';
import { useData } from '../../context/DataProvider';
import dayjs from 'dayjs';
import { 
    Card, 
    Typography, 
    CardContent, 
    Box, 
    CircularProgress, 
    TextField, 
    InputAdornment,
    IconButton,
    Button,
    Dialog,
    DialogContentText
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const Results = () => {
    const navigate = useNavigate();
    const { http } = ApiCall();
    const { goToClicked, setSpecimenFiltered, specimenFiltered } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [specimenLoad, setSpecimenLoad] = useState(false);
    const [normalResult, setNormalResult] = useState([]);
    const [elevatedResult ,setElevatedResult] = useState([]);
    const [inadequateResult,setInadequateResult] = useState([]);
    const [repeatFormConfitmation, setRepeatFormConfirmation] = useState(false);
    const [indexHolder, setIndexHolder] = useState(null);

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
                    // const specimenWithResults = data?.filter(r => r.result !== null);
                    // if (!goToClicked) {
                    //     setSpecimenFiltered(specimenWithResults);
                    // }
                    return res?.data;
                })
    })

    const filterPendings = () => {
        const pending = specimenFiltered?.map((s) => ({
            id: s?.id,
            result: s?.result,
            specimen_status: s?.specimen_status,
        }));

        return pending;
    }

    const filterIndividualRecord = async () => {        
        const specimens = filterPendings();
        try {
            const res = await http.get(`/v1/specimens/${specimens[indexHolder].id}`);
            if (res?.data?.status === 200) {
                navigate("/repeat-form");

            }
        } catch (e) {
            console.error(e.response?.data?.message);
        }
    }

    const repeatFormDialog = (e, index) => {
        const specimens = filterPendings();
        if (specimens[index].result !== "Normal") {
            setRepeatFormConfirmation(true);
            setIndexHolder(index);
        }
    }

    const showAllFunction = () => {
        const specimenWithResults = data?.filter(r => r.result !== null);
        setSpecimenFiltered([...specimenWithResults]);
        setSearchQuery("");
    }

    const closeDialog = () => {
        setRepeatFormConfirmation(false);
    }

    useEffect(()=> {
        if (!isLoading && data) {
            const specimenWithResults = data?.filter(r => r.result !== null);
            const filterNormal = data?.filter(n => n.result === "Normal");
            const filterElevated = data?.filter(n => n.result === "Elevated");
            const filterInadequate = data?.filter(n => n.result === "Inadequate");
            setNormalResult(filterNormal);
            setElevatedResult(filterElevated);
            setInadequateResult(filterInadequate);
            if (!goToClicked) {
                setSpecimenFiltered(specimenWithResults);
            }
        }
    },[isLoading, data, goToClicked, setSpecimenFiltered])
    const filteredRecords = specimenFiltered?.filter((record) =>
        record?.result.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const showRecords = !isLoading && specimenFiltered?.length !== 0;

    return (
        <div className='flex items-center justify-center mt-20 lg:ml-36'>
          {showRecords ? (
            <div className='w-full flex flex-col whitespace-nowrap gap-5'>
                {repeatFormConfitmation && (
                    <Dialog onClose={closeDialog} open={open}>
                        <DialogContentText>
                            <div className='flex flex-col justify-center items-center py-16 px-5 gap-10'>
                                <div className='text-center'>
                                    <Typography>
                                        Are you sure you want to repeat the form record for this patient?
                                    </Typography>
                                </div>
                                <div className='flex gap-10'>
                                    <Button
                                        onClick={closeDialog}
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
                                    <Button
                                        onClick={filterIndividualRecord}
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
                                        Proceed
                                    </Button>
                                </div>
                            </div>
                        </DialogContentText>
                    </Dialog>
                )}
                <div className='text-left'>
                    <Typography variant='h5'>Results (by Mother&apos;s Name)</Typography>
                </div>
                <div className='self-end'>
                    <TextField
                        label="Search by Results"
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
                <div className='self-end ml-2 flex text-white bg-blue-300'>
                    <Button
                        onClick={showAllFunction}
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
                        Show All Results
                    </Button>
                </div>
                <div className='w-full grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
                    {filteredRecords?.map((record, index) => {
                        const dateOfBirth = new Date(record?.date_and_time_of_birth);
                        const formattedDate = dayjs(dateOfBirth).format("YYYY-MM-DD");
                        const mother = `${record?.baby_last_name}, ${record?.mothers_first_name}`;

                        return (
                        <IconButton key={index} onClick={(e) => repeatFormDialog(e, index)}>
                            <Card key={index} elevation={4}>
                                <CardContent className='flex flex-col text-left lg:w-full'>
                                    <Typography variant='h6'>{mother}</Typography>
                                    <div className='flex mt-5 space-x-8 pl-5'>
                                        <div className='whitespace-nowrap'>
                                            <Typography>Birthday<br />{formattedDate}</Typography>
                                        </div>
                                        <div>
                                            <Typography>Sex<br />{record?.sex}</Typography>
                                        </div>
                                        <div>
                                            <Typography>Status<br />{record?.result}</Typography>
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
      );
}

export default Results;