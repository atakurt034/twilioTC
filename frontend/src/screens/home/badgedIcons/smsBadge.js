import React from 'react'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg'

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 3,
    top: 1,
    padding: '0 1px',
  },
}))(Badge)

export const SmsBadge = ({ count }) => {
  return (
    <IconButton
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        width: 20,
      }}
      size='small'
      color={true ? 'inherit' : 'default'}
    >
      <StyledBadge badgeContent={count} color='error'>
        <PermPhoneMsgIcon />
      </StyledBadge>
    </IconButton>
  )
}
