import React from 'react'

import { Avatar } from 'antd'

import { getAvatarInitials } from 'utils/getAvatarInitials'

interface Props {
  styles: string
  name?: string
}

const AvatarWithInitials: React.FC<Props> = ({ styles, name }) => {
  return <Avatar className={styles}>{getAvatarInitials(name || '')}</Avatar>
}

export default AvatarWithInitials
