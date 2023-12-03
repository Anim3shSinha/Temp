import React from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import  { useState, useEffect } from "react";
import Sidebar from '../../layouts/Sidebar/Sidebar'
import Card from '@mui/material/Card';
import { CONST } from "../../../../constants";
import CardContent from '@mui/material/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from "axios";
import {useNavigate} from "react-router-dom"
const drawerWidth = 240;



const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width:"50vw",
    margin: '0 auto',
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    color:"black",
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    position:"inherit",
 
    
  },
  input: {
    marginBottom: theme.spacing(2),
    // position: "inherit",
    zIndex: 0,  
  },
  
  button: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing(2),
    position:"inherit",
  },
}));

function Profile() {
  const [side, setSide] = useState(true);
  const [username, setUsername] = useState(localStorage.getItem("uname") || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [address, setAddress] = useState(localStorage.getItem("manager") || "");
  const [CS, setCS] = useState("");
  const [kw1, setKw1] = useState("");
  const [kw2, setKw2] = useState("");
  const [kw3, setKw3] = useState("");
  const [kw4, setKw4] = useState("");
  const [kw5, setKw5] = useState("");
  const [Zc, setZc] = useState("");
  const [WD, setWD] = useState();
  const [Website, setWebsite] = useState("");
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, []);


  const fetchDetails = async () => {
    const id = localStorage.getItem("uid");
    try {
      const response = await axios.get(CONST.server + "/user/getDetails/" + id);
      const data = response.data;

      setUsername(data?.name || "");
      setPhoneNumber(data?.phone || "");
      setEmail(data?.email || "");
      setAddress(data?.address || "");
      setCS(data?.country_state || "");
      setKw1(data?.keywords?.[0] || "");
      setKw2(data?.keywords?.[1] || "");
      setKw3(data?.keywords?.[2] || "");
      setKw4(data?.keywords?.[3] || "");
      setKw5(data?.keywords?.[4] || "");
      setZc(data?.zipcode || "");
      setWD(data?.description || "");
      setWebsite(data?.website || "");
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  function setDetails(e) {
    e.preventDefault();
    const userDetailData = {
      id: localStorage.getItem("uid"),
      username,
      phoneNumber,
      email,
      address,
      CS,
      kw1,
      kw2,
      kw3,
      kw4,
      kw5,
      Zc,
      WD,
      Website,
    };

    axios
      .post(CONST.server + "/user/setDetails", userDetailData)
      .then((response) => {
        navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  }

 

  function toggleSideMenu() {
    setSide(!side);
  }

  return (
    <div style={{
      backgroundColor:"#F9FBFD"}}  >
           <Box sx={{ display: 'flex' }}>
           <Sidebar/>
           <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)`, } }}
      >
        <Toolbar />
        <React.Fragment>
=
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection:"column",
          height: "100vh",
  
          position: "relative",
      
       
          
        }}
      >
           <Typography variant='h5' style={{margin:"20px",marginTop:"50px"}} >
            <strong>User Information</strong>
          </Typography>
      
      <div
  style={{
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)', // Adding a slight shadow
    transform: 'translateY(-2px)',
    display: 'flex',
    flexDirection: 'column',
    width:"50vw",
    margin: '0 auto',
  
    backgroundColor: '#fff',
    color:"black",
   

  }}
>
       

          <form className={classes.form} onSubmit={setDetails} style={{  color: 'white',padding:"50px"}} >
            <Typography variant='h7' style={{color:"black"}}>Username</Typography>
            <TextField
              className={classes.input}
             
              variant="outlined"
              value={username}
              onChange={(e)=>{setUsername(e.target.value)}}
              required
            />
            <Typography variant='h7' style={{color:"black"}}>Phone Number</Typography>
            <TextField
              className={classes.input}
             
              variant="outlined"
              value={phoneNumber}
              onChange={(e)=>{setPhoneNumber(e.target.value)}}
              required
            />
            <Typography variant='h7' style={{color:"black"}}>Email</Typography>
            <TextField
              className={classes.input}
           
              variant="outlined"
              type="email"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              required
            />
            <Typography variant='h7' style={{color:"black"}}>Address</Typography>
            <TextField
              className={classes.input}
         
              variant="outlined"
              value={address}
              onChange={(e)=>{setAddress(e.target.value)}}
              required
            />
            <Typography variant='h7' style={{color:"black"}}>City/State</Typography>
            <TextField
              className={classes.input}
           
              variant="outlined"
              value={CS}
              onChange={(e)=>{setCS(e.target.value)}}
              required
            />
            <Typography variant='h7' style={{color:"black"}}>Zip Code</Typography>
            <TextField
              className={classes.input}
       
              variant="outlined"
              value={Zc}
              onChange={(e)=>{setZc(e.target.value)}}
              required
            />
         
             <Typography variant='h7' style={{color:"black"}}>Website</Typography>
            <TextField
              className={classes.input}
            
              value={Website}
              onChange={(e)=>{setWebsite(e.target.value)}}
              variant="outlined"
            />
          <Typography variant='h7' style={{color:"black"}}>Business Description</Typography>
            <TextField
              className={classes.input}
             placeholder="Work description"
              variant="outlined"
            
              value={WD}
              onChange={(e)=>{setWD(e.target.value);}}
              
              
            />
            
            <Button
              className={classes.button}
              variant="contained"
              style={{padding:"10px",margin:"10px",backgroundColor:"#3F51B5",color:"white" }}
              type="submit"

              
            >
              <strong>Submit</strong>
            </Button>
          </form>
    
        </div>
        <div>

        </div>
      </div>
    </React.Fragment>
   
      </Box>


           </Box>
       
    </div>
  )
}

export default Profile