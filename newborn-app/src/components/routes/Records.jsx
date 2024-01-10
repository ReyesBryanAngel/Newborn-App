import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!isLoading) {
      console.log(data);
    }
  });

  

  const showRecords = data && !isLoading;

  const filteredRecords = data?.filter((record) =>
    `${record?.baby_last_name}, ${record?.mothers_first_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='flex items-center justify-center mt-20 lg:ml-36'>
      {showRecords ? (
        <div className='w-full flex flex-col whitespace-nowrap gap-10'>
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
                <Card key={index} elevation={4}>
                  <CardContent className='flex flex-col text-left lg:w-96'>
                    <Typography variant='h6'>{mother}</Typography>
                    <div className='flex mt-5 space-x-10 pl-5 lg:px-10 lg:space-x-10 lg:pl-5'>
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
        <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      }
    </div>
  );
};

export default Records;
