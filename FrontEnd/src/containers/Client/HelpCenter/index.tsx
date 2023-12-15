import React, { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import { useStep } from '../hooks/useStep'
import Article from './Article'
import Carriers from './Article/Carriers'
import Incoterms from './Article/Incoterms'
import OurCarriers from './Article/OurCarriers'
import ShipmentType from './Article/ShipmentType'
import Navigation from './Navigation'
import { AnchorLink, DataPage } from './Types'

import styles from './styles.module.scss'

const HelpCenter: React.FC = () => {
  const { t, i18n } = useTranslation(['helpCenter', 'newRate'])
  const { step, nextStep, prevStep, clickStep } = useStep(0)

  const data: DataPage[] = useMemo(
    () => [
      {
        id: 0,
        name: t('newRate:incoterms'),
        anchor: [
          { key: 'EXW', href: AnchorLink.EXW, title: t('newRate:EXW') },
          { key: 'FOB', href: AnchorLink.FOB, title: t('newRate:FOB') },
          { key: 'CIF', href: AnchorLink.CIF, title: t('newRate:CIF') },
          { key: 'DDP', href: AnchorLink.DDP, title: t('newRate:DDP') },
        ],
        component: <Incoterms />,
      },
      {
        id: 1,
        name: t('newRate:shipmentType'),
        anchor: [
          { key: 'Ocean', href: AnchorLink.OCEAN, title: t('newRate:ocean') },
          { key: 'Air', href: AnchorLink.AIR, title: t('newRate:air') },
        ],
        component: <ShipmentType />,
      },
      {
        id: 2,
        name: t('helpCenter:carriers'),
        component: <Carriers />,
      },
      {
        id: 3,
        name: t('helpCenter:ourCarriers'),
        component: <OurCarriers />,
      },
    ],
    [i18n.language]
  )

  return (
    <div className={styles.container}>
      <Navigation page={step} clickPage={clickStep} data={data} />
      <div className={styles.articleContainer}>
        <span className={styles.title}>{t('helpCenter:help')}</span>
        {data
          .filter(el => step === el.id)
          .map(el => (
            <Article
              key={el.id}
              anchor={el.anchor}
              nextPage={nextStep}
              prevPage={prevStep}
            >
              {el.component}
            </Article>
          ))}
      </div>
    </div>
  )
}

export default HelpCenter
