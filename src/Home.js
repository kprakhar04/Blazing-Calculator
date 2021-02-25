import React from 'react'
import Navbar from './components/Navbar'
import GridContainer from './components/GridContainer'

import './Home.css'
import InputMat from './components/MaterialUI'
import { withStyles } from '@material-ui/core/styles';
import styles from './styles/HomeStyles';


export const typeInfo1 = [
    { value: "1D", text: "1D" },
    { value: "2D", text: "2D" }
]
export const typeInfo2 = [
    { value: "transform", text: "Transformation" },
    { value: "itransform", text: "Inverse Transformation" }
]



const Home = ({classes}) => {
    
    return (
        <div className={classes.root}>
        
         <Navbar />
            <GridContainer />
            <InputMat />
         
          <div style={{height:'25.5vh'}}>
          </div>
        </div>
    )
}

export default withStyles(styles)(Home);