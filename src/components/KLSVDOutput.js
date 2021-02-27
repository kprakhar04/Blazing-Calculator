import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { TableBody } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container'
import styles from '../styles/MaterialUIStyles'


const KLSVDOutput = ({ result, classes }) => {
  return (
    <Container>
      {result.map(res => (
        <React.Fragment key={new Date().getTime()}>
          <Typography variant="h5" component="h2" >
            {res.Name} ({res.Desc && (res.Desc)})
      </Typography>
          <TableContainer>
            <Table className="simple table">
              <TableBody className={classes.table}>
                {res.Value.map((e, rowidx) => (
                  <TableRow key={uuidv4()} >
                    {e.map((ele, colidx) => (
                      <TableCell key={uuidv4()} align="center" className={classes.root}>
                        <input readOnly value={ele.toFixed(3)} className="inputCell" style={{ height: 40, width: 120 }} name={`${rowidx}''${colidx}`} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ height: '40px', width: '100%' }}></div>
        </React.Fragment>
      ))}

    </Container>
  )
}

export default withStyles(styles)(KLSVDOutput);