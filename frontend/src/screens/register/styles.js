import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: theme.spacing(70),
    padding: theme.spacing(4),
    margin: 'auto',
  },
  paper: {
    marginTop: 'auto',
    padding: 20,
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
