import { Typography } from '@material-ui/core'
import React from 'react'

import { useStopwatch } from 'react-timer-hook'

const DoubeDigits = ({ value }) => {
  const leftDigit = value >= 10 ? value.toString()[0] : '0'
  const rightDigit = value >= 10 ? value.toString()[1] : value.toString()

  return (
    <>
      <Typography variant='h6' component='span'>
        {leftDigit}
      </Typography>{' '}
      <Typography variant='h6' component='span'>
        {rightDigit}
      </Typography>
    </>
  )
}

export const Timer = ({ ready }) => {
  const { hours, minutes, seconds, start, reset, pause } = useStopwatch()

  React.useEffect(() => {
    if (ready) {
      start()
    } else {
      pause()
      reset()
    }
  }, [pause, ready, reset, start])

  return (
    <div>
      <DoubeDigits value={hours} /> : <DoubeDigits value={minutes} /> :{' '}
      <DoubeDigits value={seconds} />
    </div>
  )
}
