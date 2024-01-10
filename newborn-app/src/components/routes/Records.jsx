import { useState } from 'react';
import { useQuery }  from "@tanstack/react-query";
import ApiCall from '../../auth/ApiCall';
import { 
  Card, 
  Typography, 
  CardContent, 
  Box, 
  CircularProgress, 
  TextField, 
  InputAdornment } from "@mui/material";
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';


const Records = () => {
  const [specimenLoad, setSpecimenLoad] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const showRecords = data?.length > 0 && !isLoading;

  const filteredRecords = data?.filter((record) =>
    `${record?.baby_last_name}, ${record?.mothers_first_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='flex items-center justify-center mt-20 lg:ml-36'>
      {data?.length === 0 && (
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
      {showRecords ? (
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
          <div className='w-full grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
            {filteredRecords?.map((record, index) => {
              const dateOfBirth = new Date(record?.date_and_time_of_birth);
              const formattedDate = dayjs(dateOfBirth).format("YYYY-MM-DD");
              const mother = `${record?.baby_last_name}, ${record?.mothers_first_name}`;

              return (
                <Card key={index} elevation={4} sx={{ width:"330px" }}>
                  <CardContent className='flex flex-col text-left'>
                    <Typography variant='h6'>{mother}</Typography>
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
      ) :
        data?.length > 0 &&
        <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      }
    </div>
  );
};

export default Records;
