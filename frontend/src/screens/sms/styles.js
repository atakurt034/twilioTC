import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: '#eee',
    height: '100%',
  },

  cardActions: {
    display: 'flex',
    padding: 5,
    alignItems: 'center',
  },
  mine: {
    padding: 5,
    margin: 5,
    width: '70%',
    float: 'right',
    clear: 'both',
    textAlign: 'right',
    backgroundColor: theme.palette.success.light,
  },
  yours: {
    padding: 5,
    margin: 5,
    width: '70%',
    float: 'left',
    clear: 'both',
    textAlign: 'right',
    backgroundColor: theme.palette.primary.light,
  },
}))
