import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import styles from '../styles/GridItemStyles';
import Grid from '@material-ui/core/Grid';
import { TransformationContext } from '../contexts/TransformationProvider'

const GridItem = ({ name, classes }) => {
    const { currTransformation, changeTransform } = useContext(TransformationContext);
    const selected = currTransformation === name ? classes.selected : '';

    return (
        <>
            <Grid item xs={6} sm={4} className={classes.item} onClick={() => changeTransform(name)}>
                <Paper className={`${classes.paper} ${selected}`}>{name}</Paper>
            </Grid>
        </>

    )
}
export default withStyles(styles)(GridItem)