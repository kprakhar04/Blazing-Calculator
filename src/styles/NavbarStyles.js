const styles = theme => ({
    root: {
        width: "100%",
        marginBottom: "0",
    },
    appbar: {
        alignItems: "center",
    },
    grow: {
        flexGrow: 1
    },
    title: {
        color: "white",
        fontWeight: 'bold',
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
})
export default styles;