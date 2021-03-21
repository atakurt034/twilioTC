import { IconButton } from '@material-ui/core'

import AddCircleIcon from '@material-ui/icons/AddCircle'

export const AddButton = () => {
  return (
    <IconButton>
      <AddCircleIcon fontSize='large' style={{ color: 'green' }} />
    </IconButton>
  )
}
