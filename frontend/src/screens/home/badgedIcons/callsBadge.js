import React from 'react'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'
import PhoneIcon from '@material-ui/icons/Phone'

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 3,
    top: 1,
    padding: '0 1px',
  },
}))(Badge)

export const CallBadge = ({ count, callIds }) => {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        width: 20,
      }}
      size='small'
      color={true ? 'inherit' : 'default'}
    >
      <StyledBadge badgeContent={count} color='error'>
        <PhoneIcon />
      </StyledBadge>
    </div>
  )
}
