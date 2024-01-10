import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Box, CircularProgress} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ApiCall from '../auth/ApiCall';
import { useData } from '../context/DataProvider';

const Dashboard = () => {
    const navigate = useNavigate();
    const [specimenLoad, setSpecimenLoad] = useState(false);
    const { http } = ApiCall();
    const [samples, setSamples] = useState([]);
    const [results, setResults] = useState([]);
    const [elavated, setElavated] = useState([]);
    const [inadequate, setInadequate] = useState([]);
    const { setSpecimenFiltered, setGoToClicked } = useData();

    const sortByInAdequate = () => {
        setSpecimenFiltered(inadequate);
        setGoToClicked(true);
    
        navigate("/results");
      };
    
      const sortByElevated = () => {
        setSpecimenFiltered(elavated);
        setGoToClicked(true);
    
        navigate("/results");
      };

    const dashboardData = [
        {
            length: samples?.length,
            description: "Unsent Samples",
            buttonValue: "Go to Courier",
            goTo: "/courier",
            sortingFunction: null
        },
        {
            length: results?.length,
            description: "New Results",
            buttonValue: "Go to Results",
            goTo: "/results",
            sortingFunction: null
        },
        {
            length: elavated?.length,
            description: "New Elevated Results",
            buttonValue: "Go to Elevated",
            goTo: "/courier",
            sortingFunction: sortByElevated
        },
        {
            length: inadequate?.length,
            description: "Inadequate Results",
            buttonValue: "Go to Inadequate",
            goTo: "/courier",
            sortingFunction: sortByInAdequate
        }
    ]

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
        if (!isLoading) {
          const pendingSample = data?.filter(s => s.specimen_status === "Pending");
          const samplesWithResult = data?.filter(s => s.result !== null);
          const elevatedResult = data?.filter(s => s.result === "Elevated");
          const inadequateResult = data?.filter(s => s.result === "Inadequate");
          setInadequate(inadequateResult);
          setElavated(elevatedResult);
          setResults(samplesWithResult);
          setSamples(pendingSample);
        }
      }, [data, isLoading])
    
    const showRecords = !isLoading && data;
    return (
        <div className='flex items-center justify-center mt-24 lg:ml-36'>
            {showRecords ? (
                <div className='w-full grid gap-10 md:grid-cols-2'>
                    {dashboardData?.map((data, index) => (
                        <div key={index}>
                            <div>
                                <Card elevation={4} className='py-10'>
                                    <Typography>
                                        <span className='text-3xl'>{data.length}</span> <br/>
                                        <span>{data.description}</span>
                                    </Typography>
                                    <Button 
                                        onClick={() => {
                                            if (data.sortingFunction) {
                                                data.sortingFunction();
                                            } else {
                                                navigate(data.goTo);
                                            }
                                        }}
                                        sx={{ marginTop:5 }} 
                                        variant='contained'
                                    >
                                        {data.buttonValue}
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            ) : 
            <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
            }
        </div>
    )
}

export default Dashboard;