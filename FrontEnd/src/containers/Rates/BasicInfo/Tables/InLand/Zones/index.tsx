import React from 'react'

import { Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

import { InLandZoneItem, ZoneType } from 'models'

import { useOptions } from 'utils/const'
import { numberFormatter } from 'utils/formatters'

interface Props {
  zones: InLandZoneItem[]
}

const Zones: React.FC<Props> = ({ zones }) => {
  const { t } = useTranslation(['global', 'rates', 'newRate'])
  const { zoneTypeAbbr } = useOptions()

  const columns: ColumnsType<InLandZoneItem> = [
    {
      title: '#',
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
      width: 50,
      render: (_name, _row, index) => index + 1,
    },
    {
      title: t('rates:tables.zoneType'),
      dataIndex: 'zoneType',
      render: (_zoneType, _row) => zoneTypeAbbr[_row.zoneType],
    },
    {
      title: t('rates:tables.zoneName'),
      dataIndex: 'zoneName',
      render: zoneName =>
        zoneName.split(';').map((name: string) => (
          <Tag key={name} style={{ whiteSpace: 'normal' }}>
            {name}
          </Tag>
        )),
    },
    {
      title: t('rates:tables.from'),
      dataIndex: 'zipRangeFrom',
      render: (zipRangeFrom, _row) =>
        _row.zoneType === ZoneType.ZIP ? zipRangeFrom : '',
    },
    {
      title: t('rates:tables.till'),
      dataIndex: 'zipRangeTo',
      render: (zipRangeTo, _row) =>
        _row.zoneType === ZoneType.ZIP ? zipRangeTo : '',
    },
    {
      title: t('newRate:table.transitionTime'),
      dataIndex: 'transitionTime',
      render: transitionTime =>
        `${numberFormatter.format(transitionTime)} ${t('global:days')}`,
    },
  ]

  return (
    <Table
      dataSource={zones || []}
      columns={columns}
      pagination={false}
      bordered
      size="small"
      scroll={{ x: 640 }}
    />
  )
}

export default Zones
