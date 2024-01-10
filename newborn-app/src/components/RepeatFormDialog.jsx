import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";



const RepeatFormDialog = ({ onClose, proceedFunction }) => {
  const navigate = useNavigate();
  

  const cancelFunction = () => {
    onClose();
  };

//   const proceedFunction = () => {
//     onClose();
//     navigate("/repeat-form")
//   }

  return (
    <Dialog
      open={true}
      onClose={cancelFunction}
    >
      <DialogContent sx={{ justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column", padding:"2rem" }}>
        <DialogContentText 
          sx={{ 
            marginTop: "1rem", 
            textAlign: "center", 
            color: "var(--Dark, #020235)",
            leadingTrim: "both",
            textEdge: "cap",
            fontfamily: "Roboto",
            fontSize: "25px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "normal"
          }}
        >
            Are you sure you want to repeat the form record for this patient?
        </DialogContentText>
    
        <DialogActions sx={{ marginTop: "1rem" }}>
            <div className='flex gap-10 justify-center text-white'>
                <div>
                    <Button
                        onClick={cancelFunction}
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
                </div>
                <div>
                    <Button
                        onClick={proceedFunction}
                        type='submit'
                        size='medium'
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
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
  

export default RepeatFormDialog;