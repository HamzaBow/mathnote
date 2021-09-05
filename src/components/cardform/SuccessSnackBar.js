import React, { useState } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";
import { useHistory } from 'react-router-dom';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SuccessSnackBar = () => {
  const history = useHistory();

  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    history.push('/');
  };

  return (
      <Snackbar anchorOrigin={{ horizontal: "center", vertical: "top" }} open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Card Saved Successfully!
        </Alert>
      </Snackbar>
  );
};

export default SuccessSnackBar;