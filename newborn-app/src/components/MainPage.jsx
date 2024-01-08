import React from 'react'
import Dashboard from './Dashboard'
import Header from './Header.'
import Sidebar from './Sidebar'
import { Card, Box, Typography, Button } from "@mui/material";

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

const positiveColor = "warning";

const MainPage = () => {
    return (
        <>
            <Header />
            <Sidebar />
            <div  className='flex items-center justify-center h-screen'>
                <div className=' w-full grid gap-10 lg:grid-cols-2'>
                    {dashboardData.map((data, index) => (
                        <div key={index}>
                            <div>
                            <Card className='py-10'>
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
        </>
    )
}

export default MainPage;