import React from 'react'
import { AppBar } from '@material-ui/core'
import { Toolbar } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import { withStyles } from "@material-ui/core/styles";
import styles from '../styles/NavbarStyles'

const Navbar = (props) => {
    const { classes } = props;
    return (
        <AppBar position="sticky" style={{ background: "#3e206d" }} className={classes.appbar}>
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    TRANSFORMS
      </Typography>
            </Toolbar>
        </AppBar>
    )
}
export default withStyles(styles)(Navbar)