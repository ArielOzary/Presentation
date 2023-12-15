import React from 'react'

import { InfoCircleOutlined } from '@ant-design/icons'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

const Incoterms: React.FC = () => {
  const { t } = useTranslation(['helpCenter', 'newRate'])
  return (
    <div>
      <p className={styles.title}>{t('newRate:incoterms')}</p>
      <span className={styles.topic}>{t('helpCenter:4TypesOfIncoterms')}</span>
      <div id="EXW">
        <p className={styles.subTitle}>{t('newRate:EXW')}</p>
        <span className={styles.article}>
          EXW, also known as exworks is a shipment agreement that. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit
          amet, consectetur adipiscing elit Lorem ipsum dolor sit amet,
          consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur
          adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit
          Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum
          dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit
          amet, consectetur adipiscing elit Lorem ipsum dolor sit amet,
          consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur
          adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing
          elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem
          ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit
          amet, consectetur adipiscing elit Lorem ipsum dolor sit amet,
          consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur
          adipiscing elit EXW, also known as exworks is a shipment agreement
          that. Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem
          ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor
          sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet,
          consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur
          adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing
          elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem
          ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor
          sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet,
          consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur
          adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing
          elit Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem
          ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor
          sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet,
          consectetur adipiscing elit
        </span>
        <span className={styles.note}>
          <InfoCircleOutlined className={styles.icon} />
          <p>
            <strong>Note:</strong> Lorem ipsum dolor sit amet, consectetur
            adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing
            elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem
            ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor
            sit amet, consectetur adipiscing elit.
          </p>
        </span>
      </div>
      <div id="FOB">
        <p className={styles.subTitle}>{t('newRate:FOB')}</p>
        <p className={cn(styles.paragraph, styles.margin)}>
          <span className={styles.number}>1</span>Lorem ipsum dolor sit amet,
          consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur
          adipiscing elit Lorem ipsum Dolor sit amet, consectetur adipiscing
          elit Lorem.
        </p>
        <p className={styles.paragraph}>
          <span className={styles.number}>2</span>Consectetur adipiscing elit
          Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum
          dolor sit amet
        </p>
        <p className={styles.paragraph}>
          <span className={styles.number}>3</span>Ipsum dolor sit amet,
          consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur
          adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing
          elit Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem
          ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor
          sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet,
          consectetur adipiscing elit Lorem ipsum dolor sit amet.
        </p>
        <p className={styles.paragraph}>
          <span className={styles.number}>4</span>Lorem ipsum dolor sit amet,
          consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur
          adipiscing elit Lorem ipsum Dolor sit amet, consectetur adipiscing
          elit Lorem.
        </p>
      </div>
      <div id="CIF">
        <p className={styles.subTitle}>{t('newRate:CIF')}</p>
        <p className={styles.article}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam
          atque sunt dolore. Nam voluptate voluptates itaque fugiat id vel,
          voluptas eveniet reiciendis fugit dolorum magni, consectetur
          aspernatur enim. Maiores, eveniet. Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Inventore labore, est placeat deserunt
          illo soluta, quis eos hic perspiciatis et asperiores iure architecto
          nesciunt deleniti obcaecati facilis ipsa minima. Ea quas ex at facilis
          laudantium officiis voluptatem quo beatae, magnam laborum soluta,
          reiciendis exercitationem, nesciunt consequatur iusto sit repudiandae
          expedita. Fuga sint, provident saepe recusandae autem eum facere eius
          excepturi magnam reiciendis dolore, laboriosam alias qui
          exercitationem vero? Doloremque eaque libero, hic voluptate enim
          dignissimos tempora id aliquid nam earum rem itaque vero aliquam vitae
          in ab quasi! Quia assumenda nihil ex blanditiis esse quaerat aut
          reiciendis laborum ipsum omnis! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Laboriosam atque sunt dolore. Nam
          voluptate voluptates itaque fugiat id vel, voluptas eveniet reiciendis
          fugit dolorum magni, consectetur aspernatur enim. Maiores, eveniet.
        </p>
      </div>
      <div id="DDP">
        <p className={styles.subTitle}>{t('newRate:DDP')}</p>
        <p className={styles.article}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nihil
          totam voluptatibus saepe accusantium, voluptate alias laboriosam? Sit,
          aliquam! Optio voluptate consequuntur repellendus mollitia commodi
          deleniti explicabo dolores, et odit tempore suscipit inventore rerum
          tenetur iste. Repellendus esse non praesentium assumenda ea animi
          ipsum fugit corporis, rem sequi voluptas repellat, unde delectus ullam
          fugiat vel error blanditiis culpa ut nisi atque. Ad quo omnis possimus
          tenetur, rerum harum consequuntur ullam autem, a sed tempore, eos
          sequi rem quae beatae aliquam! Porro inventore earum ab accusamus quas
          tenetur saepe alias excepturi ut, in asperiores modi aut? Vel laborum
          sit consequatur earum fuga, eveniet illum, dolor possimus facilis
          consectetur laudantium. Quod omnis consequuntur atque explicabo
          dolorem nam, sit quas expedita repudiandae molestias perferendis
          accusamus natus alias ipsam illo quibusdam molestiae voluptate
          asperiores? Maxime id, iure, reprehenderit totam voluptas eveniet
          sapiente incidunt veritatis officia tenetur, doloremque pariatur vero
          commodi exercitationem magni. Velit magnam quae aliquid quis libero
          odio numquam quos minus vel officia? Minima in amet reprehenderit
          asperiores numquam repellat magnam. Accusamus vero sit libero
          perspiciatis nemo dicta maxime amet dignissimos pariatur cupiditate
          facilis incidunt eos odio inventore, cum qui quae officiis, ullam
          nihil sunt! Dolore sit incidunt delectus maxime atque similique
          tempore placeat nemo facere nulla, voluptatem harum in reprehenderit
          fugit veritatis temporibus aliquam? Ut nihil, explicabo iusto hic
          similique labore unde dignissimos sunt velit adipisci fugiat ullam est
          officiis totam maxime odio, obcaecati reprehenderit voluptatum
          molestias. Ex provident voluptates eveniet voluptas, nulla odio saepe
          similique sunt asperiores voluptatibus magnam quas. Iure doloribus
          nihil facere assumenda placeat quia amet corporis recusandae
          consequuntur aut soluta, vitae, fuga impedit. Consequuntur dolorum
          quae quisquam, repellat ea culpa, quas ab facilis odio deleniti qui
          eos laboriosam. Omnis expedita veniam facilis rem porro, quas enim
          magnam, ex illo sequi, neque exercitationem saepe modi fuga excepturi
          perspiciatis quis.
        </p>
      </div>
    </div>
  )
}

export default Incoterms
