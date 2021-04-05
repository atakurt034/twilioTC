import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: '#eee',
    height: '440px',
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
  missed: {
    border: '1px solid red',
    color: 'red',
  },
  seen: {
    color: 'inherit',
  },
}))
