// eslint-disable-next-line
import { ThemeConfig } from 'antd'

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#6C5DD3',
    colorText: '#4F4F4F',
    fontFamily: 'Helvetica',
    borderRadius: 5,
    borderRadiusLG: 5,
    borderRadiusSM: 5,
    borderRadiusXS: 5,
  },
  components: {
    Button: {
      paddingContentHorizontal: 40,
      fontSize: 14,
      fontSizeLG: 14,
      fontSizeSM: 14,
      fontSizeXL: 14,
    },
    Input: {
      borderRadius: 2,
      borderRadiusLG: 2,
      borderRadiusXS: 2,
      borderRadiusSM: 2,
    },
    Select: {
      borderRadius: 2,
      borderRadiusLG: 2,
      borderRadiusXS: 2,
      borderRadiusSM: 2,
    },
    InputNumber: {
      borderRadius: 2,
      borderRadiusLG: 2,
      borderRadiusXS: 2,
      borderRadiusSM: 2,
    },
    Checkbox: {
      borderRadius: 2,
      borderRadiusLG: 2,
      borderRadiusXS: 2,
      borderRadiusSM: 2,
    },
    Typography: {
      colorLink: '#6C5DD3',
    },
    DatePicker: {
      colorLink: '#6C5DD3',
      colorLinkHover: '#9687e0',
    },
  },
}

export const XS_BREAKPOINT = 480
export const SM_BREAKPOINT = 576
export const M_BREAKPOINT = 768
export const LG_BREAKPOINT = 992
export const XL_BREAKPOINT = 1179
export const XXL_BREAKPOINT = 1600
