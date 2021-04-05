import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: theme.spacing(70),
    padding: theme.spacing(1),
    margin: 'auto',
  },
  paper: {
    padding: 15,
  },
  avatar: {
    margin: 'auto',
  },
  header: {
    color: '#000',
    textAlign: 'center',
  },
  button: {
    marginTop: 5,
  },
}))
