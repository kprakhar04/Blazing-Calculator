import React from 'react';
import Home from './Home'
import { TransformationProvider } from './contexts/TransformationProvider'



const App = ({classes}) => {
    return (
        <TransformationProvider>
            
         <Home/>
            
        </TransformationProvider>
    );
}


export default (App);

