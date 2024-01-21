import React, { useState } from 'react';
import { 
    Typography, 
    Paper, 
    Box, 
    Button
} from '@mui/material';
import GmailIcon from "../assets/gmail-icon.png";
import { MuiOtpInput } from 'mui-one-time-password-input';
import ApiCall from "./ApiCall";
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { LoadingButton } from '@mui/lab';

const VerifyAccount = () => {
    const [otp, setOtp] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const { http } = ApiCall();
    const { id } = useParams();
    const navigate = useNavigate();

    const handleChange = (otpValue) => {
        setOtp(otpValue);
    }

    const closeSnackBar = () => {
        setOpenSnackBar(false);
      }

    const verify = async () => {
        await http.put(`/auth/verify/${id}`, {otp: otp})
        .then((res) => {
            if (res?.data?.code === 201) {
                setSuccessMessage(res?.data?.message);
                setErrorMessage(null)
                setOpenSnackBar(true);
                setTimeout(() => {
                    navigate('/login');
                  }, 5000)
            }
        })
        .catch((e) => {
            setErrorMessage(e?.response?.data?.message);
        })
    }

    const resend = async () => {
        setResendLoading(true);
        await http.put(`/auth/resend-otp/${id}`)
        .then((res) => {
            if (res?.data?.code === 200) {
                setSuccessMessage(res?.data?.message);
                setOpenSnackBar(true);
                setResendLoading(false);
            }
        })
        .catch((e) => {
            setErrorMessage(e?.response?.data?.message);
            setResendLoading(false);
        })
    }

    return (
        <>
            {openSnackBar && (
                <Snackbar 
                    open={open} 
                    autoHideDuration={5000} 
                    onClose={closeSnackBar} 
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={closeSnackBar}
                        severity="success"
                    >
                    {successMessage}
                    </MuiAlert>
                </Snackbar>
            )}
        <div className='flex items-center justify-center lg:justify-between md:bg-blue-100 p-5 mt-5'>
                <div className='hidden lg:block text-left'>
                    <Typography variant='h6' lineHeight={2}>
                        You&apos;re one step away for having an account at Newborn Application. <br />
                        Please provide the OTP for verification.
                    </Typography>
                </div>
                <div className='w-96 xl:w-1/3'>
                    <Paper
                        elevation={3}
                        style={{
                            padding: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: "4rem",
                            paddingBottom: "3rem",
                            gap:"20px"
                        }}
                    >
                        <div className='flex items-center flex-col'>
                            <div>
                                <Box
                                    component="img"
                                    className='h-24'
                                    alt="gmail icon."
                                    src={GmailIcon} />
                            </div>
                            <Typography>
                                OTP VERIFICATION <br /><br /> code has been sent to
                                reyesangelbryan@gmail.com
                            </Typography>
                        </div>
                        <div className='w-80'>
                            <MuiOtpInput
                                length={6}
                                onChange={handleChange}
                                value={otp} />
                        </div>
                        <Typography>Didn&apos;t get the otp? <LoadingButton loading={resendLoading} onClick={resend}>Resend</LoadingButton></Typography>
                        <Button variant='contained' onClick={verify}>Verify</Button>
                        <div className='text-start text-sm'>
                            {<p style={{ color: "#BD271E" }}>{errorMessage}</p>}
                        </div>    
                    </Paper>
                </div>
            </div></>
    )
}

export default VerifyAccount;