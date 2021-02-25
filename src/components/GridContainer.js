import React from 'react';
import Grid from '@material-ui/core/Grid';
import { allTransformsName } from '../helpers/transforms'
import GridItem from './GridItem'
import { withStyles } from '@material-ui/core/styles';
import styles from '../styles/GridContainerStyles';

const GridContainer = ({ classes }) => {
    return (
        <>
            <Grid container spacing={3} className={classes.container}>
                {allTransformsName.map((transformName, idx) => (
                    <GridItem key={idx} name={transformName} />
                ))}
            </Grid>
        </>
    )
}
export default withStyles(styles)(GridContainer)
