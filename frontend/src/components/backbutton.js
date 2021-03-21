import { Button } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

export const BackButton = ({ history }) => {
  return (
    <>
      <Button startIcon={<ArrowBackIcon />}> </Button>
    </>
  )
}
