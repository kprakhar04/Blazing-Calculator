import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from '../styles/TypeofTransformationStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const TypeofTransformation = ({ classes, typeInfo, type, handleTypeChange ,label}) => {

    return (
                <>
                <Select style={{margin:'1rem'}} labelId="label" id="select" value={type} onChange={e => handleTypeChange(e.target.value)}>
                {typeInfo.map((t, idx) => (
                        <MenuItem key={idx} value={t.value}>{t.text}</MenuItem>
                    ))}
            
                </Select>
                </>
               
    );
}
export default withStyles(styles)(TypeofTransformation)