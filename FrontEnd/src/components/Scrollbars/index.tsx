import React, { forwardRef } from 'react'

import cn from 'classnames'
import {
  Scrollbars as BasicScrollbars,
  ScrollbarProps,
} from 'react-custom-scrollbars-2'

import styles from './styles.module.scss'

export type ScrollbarRef = BasicScrollbars

const Scrollbars = forwardRef<ScrollbarRef, ScrollbarProps>(
  ({ className, ...props }, ref) => (
    <BasicScrollbars
      {...props}
      ref={ref}
      className={cn(styles.scrollBars, className)}
    />
  )
)

export default Scrollbars
