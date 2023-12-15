import React from 'react'

import { Radio, Space } from 'antd'
import { Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import useInputNumberControl from 'components/FormControls/hooks/inputNumberControl'
import { useRadioGroupControl } from 'components/FormControls/hooks/radioGroupControl'
import { useSelectControl } from 'components/FormControls/hooks/selectControl'

import { useConfig } from '../../hooks/config'
import { LCLSchemaType, UnitFieldsType } from '../hook/lclFormSchema'

import { dimensionFormatOptions, weightFormatOptions } from 'utils/const'
import { handleKeyPress } from 'utils/handleKeyPress'

import styles from './styles.module.scss'

interface Props {
  index: number
  control: Control<{ unit: UnitFieldsType[] }>
  errorText: () => JSX.Element | null | undefined
}

const LCLFormFields: React.FC<Props> = ({ index, control, errorText }) => {
  const { t } = useTranslation(['searchQuote', 'global'])

  const { renderRadioGroupControl } = useRadioGroupControl<LCLSchemaType>()
  const { renderSelectControl } = useSelectControl<LCLSchemaType>()
  const { renderInputNumberControl } = useInputNumberControl<LCLSchemaType>()

  const { packageTypes } = useConfig()

  return (
    <>
      <div className={styles.packageRow}>
        <Controller
          name={`unit.${index}.packageType`}
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
                  {packageTypes.map(type => (
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
      </div>
      <div className={styles.parametersRow}>
        <div className={styles.space}>
          <span className={styles.label}>
            <span className={styles.bold}>
              {t('searchQuote:load.lclForm.dimensions')}
            </span>{' '}
            ({t('searchQuote:load.lclForm.paramsPerUnit')})
          </span>
          <div className={styles.compact}>
            <Space.Compact>
              <Controller
                name={`unit.${index}.length`}
                control={control}
                render={renderInputNumberControl(
                  {
                    className: styles.block,
                  },
                  {
                    prefix: 'L',
                    controls: false,
                    className: styles.input,
                    onKeyPress: handleKeyPress,
                  },
                  { dimensions: true }
                )}
              />
              <Controller
                name={`unit.${index}.width`}
                control={control}
                render={renderInputNumberControl(
                  {
                    className: styles.block,
                  },
                  {
                    prefix: 'W',
                    controls: false,
                    className: styles.input,
                    onKeyPress: handleKeyPress,
                  },

                  { dimensions: true }
                )}
              />
              <Controller
                name={`unit.${index}.height`}
                control={control}
                render={renderInputNumberControl(
                  {
                    className: styles.block,
                  },
                  {
                    prefix: 'H',
                    controls: false,
                    className: styles.input,
                    onKeyPress: handleKeyPress,
                  },
                  { dimensions: true }
                )}
              />
              <Controller
                name={`unit.${index}.dimensionsFormat`}
                control={control}
                render={renderSelectControl(
                  {},
                  {
                    options: dimensionFormatOptions,
                    size: 'large',
                    className: styles.select,
                  }
                )}
              />
            </Space.Compact>
            <span className={styles.errorText}>{errorText()}</span>
          </div>
        </div>
        <div className={styles.space}>
          <span className={styles.label}>
            <span className={styles.bold}>{t('global:weight')}</span> (
            {t('searchQuote:load.lclForm.perUnit')})
          </span>
          <Space.Compact>
            <Controller
              name={`unit.${index}.weightPerUnit`}
              control={control}
              render={renderInputNumberControl(
                { className: styles.block },
                {
                  placeholder: t('global:weight'),
                  controls: false,
                  className: styles.inputWeight,
                  onKeyPress: handleKeyPress,
                }
              )}
            />
            <Controller
              name={`unit.${index}.weightFormat`}
              control={control}
              render={renderSelectControl(
                {},
                {
                  options: weightFormatOptions,
                  size: 'large',
                  className: styles.select,
                }
              )}
            />
          </Space.Compact>
        </div>
      </div>
    </>
  )
}

export default LCLFormFields
