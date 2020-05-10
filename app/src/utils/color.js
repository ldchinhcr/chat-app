import { makeStyles } from "@material-ui/core/styles";
import {
  deepOrange,
  red,
  deepPurple,
  indigo,
  teal,
  amber,
  blueGrey,
  cyan,
} from "@material-ui/core/colors";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(0),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  indigo: {
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500],
  },
  teal: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[500],
  },
  amber: {
    color: theme.palette.getContrastText(amber[500]),
    backgroundColor: amber[500],
  },
  blueGrey: {
    color: theme.palette.getContrastText(blueGrey[500]),
    backgroundColor: blueGrey[500],
  },
  cyan: {
    color: theme.palette.getContrastText(cyan[500]),
    backgroundColor: cyan[500],
  },
}));
