import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { TableBody } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import { TransformationContext } from '../contexts/TransformationProvider';
import { otherTransform, dftTransform, klTransform, svdTransform } from '../functions/calculateTransform';
import { casecheck } from '../helpers/casecheck';
import { useForm } from "react-hook-form";
import { typeInfo1, typeInfo2 } from '../Home';
import TypeofTransformation from './TypeofTransformation';
import { validation } from '../functions/validation';
import { TextField } from '@material-ui/core';
import styles from '../styles/MaterialUIStyles'
import OtherTransformOutput from './otherTransformOutput';
import '../css/MaterialUI.css';
import KLSVDOutput from './KLSVDOutput';



let result = [];
let flag = false;
const InputMat = ({ classes }) => {
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [errDis, setErrDis] = useState({
    error: null,
    disable: true,
  });
  const [open, setOpen] = useState(false);
  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const [inputMat, setInputMat] = useState(Array.from({ length: rows }, () => Array.from({ length: cols }, () => "")));
  const { currTransformation, type, handleTypeChange, typeDimension, handleTypeDimensionChange } = useContext(TransformationContext);
  useEffect(() => {
    const outerMat = [];
    for (let i = 0; i < rows; i++) {
      const innerMat = [];
      for (let j = 0; j < cols; j++) {
        if (i < inputMat.length && j < inputMat[i].length) {
          innerMat[j] = inputMat[i][j];
        } else {
          innerMat[j] = "";
        }
      }
      outerMat.push(innerMat);
    }
    setInputMat(outerMat);
    if (rows > 0 && cols > 0) {
      setErrDis({ ...errDis, disable: false });
    } else {
      setErrDis({ ...errDis, disable: true });
    }
  }, [rows, cols])



  const updateRowsCols = (event) => {
    if (event.target.name === 'row') {
      if (event.target.value > 8) {
        event.target.value = 8;
      }
      setRows(event.target.value);
    }
    else {
      if (event.target.value > 8) {
        event.target.value = 8;
      }
      setCols(event.target.value);
    }
  }
  const handleChange = (e, rowidx, colidx) => {
    let newData = [...inputMat];
    newData[rowidx][colidx] = e.target.value;
    setInputMat(newData);
  }

  const switchData = e => {
    e.preventDefault();
    const data = { target: { value: "" } };
    for (let row = 0; row < result[0].Value.length; row++) {
      for (let col = 0; col < result[0].Value[0].length; col++) {
        let ele = result[0].Value[row][col];
        ele = String(ele).match('i') ? ele : ele.toFixed(3);
        data.target.value = ele;
        handleChange(data, row, col);
      }
    }
  }

  const handleTransform = () => {
    const errorMsg = validation(currTransformation, type, typeDimension, rows, cols);
    setErrDis({ ...errDis, error: errorMsg });
    if (errorMsg) setOpen(true);
    if (errorMsg !== null) {
      return;
    }
    let tempResult = [];

    if (casecheck(currTransformation, 'dft')) {
      flag = true;
      tempResult = dftTransform(inputMat, rows, cols, typeDimension, type, currTransformation);
    } else if (casecheck(currTransformation, 'kl')) {
      flag = false;
      tempResult = klTransform(inputMat, rows, cols, type);
    } else if (casecheck(currTransformation, 'svd')) {
      flag = false;
      tempResult = svdTransform(inputMat, rows, cols, type);
    } else {
      flag = true;
      tempResult = (otherTransform(inputMat, rows, cols, typeDimension, type, currTransformation));
    }
    if (typeof tempResult === 'string') {
      setOpen(true);
      setErrDis({ ...errDis, error: tempResult });
      result = [];
      return;
    }
    result = tempResult;

  }

  const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


  let rowsArr = [];
  let colsArr = [];
  const rowsCols = () => {
    for (let i = 1; i <= +rows; i++) rowsArr.push(1);
    for (let i = 1; i <= +cols; i++) colsArr.push(0);
  }
  rowsCols();
  const { register, handleSubmit, errors } = useForm();

  return (
    <div>

      <form onSubmit={handleSubmit(handleTransform)}>

        <div className="dropdown">
          <TypeofTransformation typeInfo={typeInfo1} type={typeDimension} handleTypeChange={handleTypeDimensionChange} label='Dimension' />
          <TypeofTransformation typeInfo={typeInfo2} type={type} handleTypeChange={handleTypeChange} label='Transform' />
        </div>
        <div className='rowCols'>

          <TextField id="outlined-basic" style={{ width: '4rem' }} label="Rows" name='row' value={rows} variant="outlined" onChange={updateRowsCols} />

          <TextField id="outlined-basic1" style={{ width: '4rem' }} label="Cols" name='col' value={cols} variant="outlined" onChange={updateRowsCols} />
        </div>
        <TableContainer>
          <Table className="simple table">
            <TableBody>
              {rows >= 0 && cols >= 0 && rowsArr.map((e, rowidx) => (
                <TableRow key={rowidx} className={classes.rows}>
                  {colsArr.map((ele, colidx) => (
                    <TableCell key={colidx} align="center" className={classes.root}>
                      <input title='Alphabets Are Not Allowed [ Except i ]' pattern="^[+-i0-9]*$" inputmode="numeric" value={inputMat.length > 0 && inputMat[rowidx][colidx]} onChange={e => handleChange(e, rowidx, colidx)} className="inputCell" name={`${rowidx}''${colidx}`} ref={register({ required: true })} type='text' />
                      {errors[`${rowidx}''${colidx}`] && <span style={{ color: 'red' }}>*Required</span>}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>



        <div className="btnDiv">
          <button type='submit' className="pulse raise" disabled={errDis.disable}>
            <span style={{ color: 'black' }}>Compute</span>
          </button>
          <button type="button" className='pulse raise' id='switchData' disabled={result.length === 0} onClick={switchData}><span style={{ color: 'black' }}>	Switch</span></button>
          <button type="reset" className='pulse raise' id='resetButton'><span style={{ color: 'black' }}>Reset</span></button>
        </div>

        {errDis.error && (<>
          <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {errDis.error}
            </Alert>
          </Snackbar>
        </>)
        }


      </form>
      <Divider className={classes.division} />

      {flag ? <OtherTransformOutput result={result} /> : <KLSVDOutput result={result} />}
    </div>
  );
}
export default withStyles(styles)(InputMat);
