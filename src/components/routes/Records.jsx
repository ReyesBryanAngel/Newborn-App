import { useEffect, useState } from 'react';
import { useQuery }  from "@tanstack/react-query";
import ApiCall from '../../auth/ApiCall';
import { 
  Card, 
  Typography, 
  CardContent, 
  Tooltip, 
  TextField, 
  InputAdornment,
  Button,
  IconButton,
  Dialog,
  DialogContentText
} from "@mui/material";
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";


const Records = () => {
  const [specimenLoad, setSpecimenLoad] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [idFetcher, setIdFetcher] = useState(null);
  const [filteredFetcher, setFilteredFetcher] = useState([]);
  const navigate = useNavigate();
  const { http } = ApiCall();

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
  });

  const getRecord = async (patientId) => {
    await http.get(`v1/specimens/${patientId}`)
        .then((res) => {
            if (res?.status === 200) {
                navigate("/update-form")
            }
    })
  }

  const closeDialog = () => {
    setDeleteDialog(false);
  }

  const deleteRecord = async () => {
    await http.delete(`v1/specimens/${idFetcher}`)
    .then(() => {
      setDeleteDialog(false);
      setFilteredFetcher((prevRecords) =>
        prevRecords.filter((record) => record.id !== idFetcher)
      );
    });
  }

  useEffect(() => {
    if (!isLoading && data) {
      const filteredRecords = data?.filter((record) =>
        `${record?.baby_last_name}, ${record?.mothers_first_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFetcher(filteredRecords);
    }
  }, [data, isLoading, searchQuery]);

  const showRecords = data && !isLoading;

  return (
    <div className='flex items-center justify-center mt-20 lg:ml-52'>
        {deleteDialog && (
          <Dialog onClose={closeDialog} open={open}>
            <DialogContentText>
                <div className='flex flex-col justify-center items-center py-16 px-5 gap-10 relative'>
                    <div className='text-center mt-5'>
                        <Typography>
                            Are you sure you want to delete this record?
                        </Typography>
                    </div>
                    <div className='absolute right-2 top-2'>
                        <IconButton onClick={closeDialog}>
                            <HighlightOffRoundedIcon/>
                        </IconButton>
                        
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
                            Cancel
                        </Button>
                        <Button
                            onClick={deleteRecord}
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
                            Delete
                        </Button>
                    </div>
                </div>
            </DialogContentText>
        </Dialog>
      )}
      {data?.length == 0 && !isLoading && (
          <div className='flex flex-col justify-center items-center mt-20'>       
              <div>
                  <Typography size='m' style={{ fontSize:"20px", fontWeight:"500" }}>You have no Record Batches</Typography>
                  <Typography size='s'>Fill up a Specimen Form to add Records.</Typography>
              </div>
              <div className='flex justify-center items-center p-3 text-white'>
                  <ReceiptLongIcon sx={{ height:"300px", width:"300px", color:"#6DB3F2" }} />   
              </div>  
          </div>
      )}
      {showRecords && data?.length > 0 && (
        <div className='flex lg:w-full flex-col gap-10'>
          <div className='text-left'>
            <Typography variant='h5'>Patients (by Mother&apos;s Name)</Typography>
          </div>
          <div className='self-end'>
            <TextField
              label="Search by Mother's Name"
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
          <div className='grid gap-10 md:grid-cols-2 xl:grid-cols-3'>
            {filteredFetcher?.map((record, index) => {
              const dateOfBirth = new Date(record?.date_and_time_of_birth);
              const formattedDate = dayjs(dateOfBirth).format("YYYY-MM-DD");
              const mother = `${record?.baby_last_name}, ${record?.mothers_first_name}`;

              return (
                <Card key={index} elevation={4} sx={{ width:"330px" }}>
                  <CardContent className='flex flex-col text-left'>
                    <div className='flex justify-between items-center'>
                      <Typography variant='h6'>{mother}</Typography>
                      <div>
                        <Tooltip title='Edit'>
                          <IconButton onClick={() => {getRecord(record?.id)}}>
                            <EditIcon color='primary'/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                          <IconButton onClick={() => {
                            setDeleteDialog(true);
                            setIdFetcher(record?.id);
                          }}>
                            <DeleteIcon color='error'/>
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                    <div className='flex mt-5 space-x-10 pl-5'>
                      <div className='whitespace-nowrap'>
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
        </div>
      )}
    </div>
  );
};

export default Records;
