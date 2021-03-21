import React from 'react'

import { Box, makeStyles, Typography } from '@material-ui/core'

const useStyels = makeStyles((theme) => ({
  container: {
    height: 50,
    marginTop: 'auto',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
  },
  copy: {
    textAlign: 'center',
    margin: 'auto',
  },
}))

export const Footer = () => {
  const classes = useStyels()

  const date = new Date().getFullYear()

  return (
    <Box className={classes.container}>
      <Typography className={classes.copy}>
        &copy;
        {date}
      </Typography>
    </Box>
  )
}
