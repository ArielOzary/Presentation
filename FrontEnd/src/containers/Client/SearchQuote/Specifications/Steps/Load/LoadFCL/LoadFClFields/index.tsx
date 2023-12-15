import React from 'react'

import { Radio, Space } from 'antd'
import { Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import useInputNumberControl from 'components/FormControls/hooks/inputNumberControl'
import { useRadioGroupControl } from 'components/FormControls/hooks/radioGroupControl'
import { useSelectControl } from 'components/FormControls/hooks/selectControl'

import { FCLSchemaType, LoadFieldsType } from '../hooks/fclFormSchema'

import { containerTypes, fclWeightFormatOptions } from 'utils/const'
import { handleKeyPress } from 'utils/handleKeyPress'

import styles from './styles.module.scss'

interface Props {
  index: number
  control: Control<{ unit: LoadFieldsType[] }>
}

const LoadFCLFields: React.FC<Props> = ({ index, control }) => {
  const { t } = useTranslation(['searchQuote', 'quote', 'global'])

  const { renderSelectControl } = useSelectControl<FCLSchemaType>()
  const { renderRadioGroupControl } = useRadioGroupControl<FCLSchemaType>()
  const { renderInputNumberControl } = useInputNumberControl<FCLSchemaType>()

  return (
    <>
      <div className={styles.packageRow}>
        <Controller
          name={`unit.${index}.unitsQuantity`}
          control={control}
          render={renderInputNumberControl(
            {
              label: <strong># {t('searchQuote:load.lclForm.ofUnits')}</strong>,
            },
            {
              placeholder: '1',
              size: 'large',
              className: styles.inputNumber,
              onKeyPress: handleKeyPress,
            }
          )}
        />
        <Controller
          name={`unit.${index}.containerType`}
          control={control}
          render={renderRadioGroupControl(
            {
              label: (
                <strong>{t('searchQuote:load.lclForm.packageLabel')}</strong>
              ),
            },
            {
              size: 'large',
              className: styles.radioBtnBlock,
              children: (
                <>
                  {containerTypes.map(type => (
                    <Radio.Button
                      key={type.value}
                      value={type.value}
                      className={styles.radioBtn}
                    >
                      {type.label}
                    </Radio.Button>
                  ))}
                </>
              ),
            }
          )}
        />
      </div>
      <Space.Compact className={styles.inputAddon}>
        <Controller
          name={`unit.${index}.weight`}
          control={control}
          render={renderInputNumberControl(
            {
              label: (
                <strong className={styles.label}>
                  {t('quote:total')} {t('global:weight')}
                </strong>
              ),
            },
            {
              placeholder: '0',
              size: 'large',
              controls: false,
              onKeyPress: handleKeyPress,
            }
          )}
        />
        <Controller
          name={`unit.${index}.weightFormat`}
          control={control}
          render={renderSelectControl(
            { label: <div /> },
            {
              options: fclWeightFormatOptions,
              className: styles.select,
            }
          )}
        />
      </Space.Compact>
    </>
  )
}

export default LoadFCLFields
