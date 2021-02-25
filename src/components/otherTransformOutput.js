import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import {Typography} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { TableBody } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import styles from '../styles/MaterialUIStyles'


 const OtherTransformOutput=({result,classes})=> { 
  
  return (
    
    <Container>
      {result.map(res => (
        <>
        <Typography variant="h5" component="h2" >
        {res.Name} {res.Desc && (res.Desc)}
      </Typography>
       <TableContainer>
       <Table className="simple table">
         <TableBody>
           {res.Value.map((e, rowidx) => (
             <TableRow key={rowidx} >
               {e.map((ele, colidx) => (
                 <TableCell key={colidx} align="center" className={classes.root}> 
                 <input readOnly value={String(ele).match('i') ? ele:ele.toFixed(3)} style={{fontWeight: 'bold', height: 40, width: 120, borderRadius:5, padding:5 }} name={`${rowidx}''${colidx}`}  />
                 </TableCell>
               ))}
             </TableRow> 
           ))}
         </TableBody>
       </Table>
     </TableContainer>
     </>
      ))}
    
     
    </Container>
  )
}
 
export default withStyles(styles)(OtherTransformOutput);