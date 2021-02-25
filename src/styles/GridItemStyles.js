const styles = theme => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: "white",
        background: "#d89cf6",
        opacity:'0.9'
    },
    selected: {
        background: "#916dd5",
        boxShadow: "2px 3px #ffefa0",
        transition: "ease-in transform 0.1s",
        color: "black",
        transform: "scale(1.05)",
        opacity:'1'
    }
});
export default styles
