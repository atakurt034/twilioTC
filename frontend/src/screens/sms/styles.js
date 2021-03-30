import { makeStyles, fade } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  sideIcons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
  },
  paper: {
    backgroundColor: '#eee',
    height: '100%',
  },
  sidePanel: {
    minHeight: '80vh',
  },
  icon: {
    width: 70,
  },
  cardActions: {
    display: 'flex',
    padding: 5,
    alignItems: 'center',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    flex: 1,
    width: '100%',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    minWidth: '100%',
  },
}))
