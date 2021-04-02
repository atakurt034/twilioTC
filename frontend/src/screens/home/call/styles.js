import { makeStyles, fade } from '@material-ui/core'

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
  buttons: {
    borderRadius: '100%',
    height: 70,
    width: 70,
    textTransform: 'none',
    margin: 15,
    backgroundColor: '#fff',
    padding: 5,
  },
  numbers: {
    lineHeight: '1',
  },
}))
