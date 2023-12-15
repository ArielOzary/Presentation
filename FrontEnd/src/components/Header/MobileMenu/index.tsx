import React, { useCallback, useMemo, useState } from 'react'

import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'

import { useRole } from '../../../utils/hooks/roleHook'
import { useMobileItems } from './configItems'

import { LG_BREAKPOINT } from 'utils/antd'

import styles from './styles.module.scss'

const MobileMenu: React.FC = () => {
  const { i18n } = useTranslation(['global'])

  const { width } = useWindowSize()

  const [open, setOpen] = useState<boolean>(false)
  const handleOpenChange = useCallback(() => setOpen(open => !open), [])

  const { adminItems, freightForwarderItems } = useMobileItems()
  const { admin, freightForwarder } = useRole()

  const items = useMemo(() => {
    if (admin) return adminItems
    if (freightForwarder) return freightForwarderItems
    return []
  }, [i18n.language])

  return width <= LG_BREAKPOINT ? (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button size="large" type="text" className={styles.trigger}>
        {open ? <CloseOutlined /> : <MenuOutlined />}
      </Button>
    </Dropdown>
  ) : null
}

export default MobileMenu
