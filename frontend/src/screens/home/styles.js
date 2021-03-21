import { makeStyles } from '@material-ui/core'

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
    justifyContent: 'space-between',
  },
}))
