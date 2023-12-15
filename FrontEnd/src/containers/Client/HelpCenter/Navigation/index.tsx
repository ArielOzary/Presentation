import React from 'react'

import { Anchor } from 'antd'

import { DataPage } from '../Types'
import NavigationItem from './NavigationItem'

import styles from './styles.module.scss'

interface IProps {
  page: number
  clickPage: (value: number) => void
  data: DataPage[]
}
const Navigation: React.FC<IProps> = ({ page, data, clickPage }) => {
  const showMenu = () => {
    return (
      <div className={styles.anchorsContainer}>
        {data
          .filter(el => el.id === page)
          .map(
            el =>
              el.id === page && (
                <Anchor
                  key={el.id}
                  items={el.anchor}
                  affix={false}
                  className={styles.item}
                />
              )
          )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        {data.map(el => (
          <div key={el.id}>
            <NavigationItem
              clickPage={clickPage}
              name={el.name}
              id={el.id}
              page={page}
            />
            {el.id === page ? showMenu() : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Navigation
