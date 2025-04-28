import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const Layout = {
  window: {
    width,
    height,
  },
  screen: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  // Common spacing values
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  // Border radius values
  borderRadius: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
    round: 9999,
  },
};