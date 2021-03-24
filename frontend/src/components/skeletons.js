import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'

export const Skeletons = (props, { left }) => {
  return (
    <div>
      <Skeleton {...props} />
      <Skeleton {...props} style={{ marginLeft: 'auto' }} />
      <Skeleton {...props} style={{ marginLeft: 'auto' }} />
      <Skeleton {...props} />
    </div>
  )
}
