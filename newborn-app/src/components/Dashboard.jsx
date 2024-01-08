import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button } from "@mui/material";

const Dashboard = () => {
    const navigate = useNavigate();
    const dashboardData = [
        {
            length: 4,
            description: "Unsent Samples",
            buttonValue: "Go to Courier"
        },
        {
            length: 23,
            description: "New Results",
            buttonValue: "Go to Results"
        },
        {
            length: 23,
            description: "New Elevated Results",
            buttonValue: "Go to Elevated"
        },
        {
            length: 23,
            description: "Inadequate",
            buttonValue: "Go to Inadequate"
        }
    ]

    return (
        <div className='flex items-center justify-center mt-24 lg:ml-36'>
            <div className='w-full grid gap-10 lg:grid-cols-2'>
                {dashboardData.map((data, index) => (
                    <div key={index}>
                        <div>
                            <Card elevation={4} className='py-10'>
                                <Typography>
                                    <strong>{data.length}</strong> <br/>
                                    <span>{data.description}</span>
                                </Typography>
                                <Button sx={{ marginTop:5 }} variant='contained'>{data.buttonValue}</Button>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard;