import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

// Custom SVG Icons - Outline
import HomeOutline from '../../assets/icons/outline/home.svg';
import ConfirmationNumberOutline from '../../assets/icons/outline/confirmation_number.svg';
import SearchOutline from '../../assets/icons/outline/search.svg';
import TrainOutline from '../../assets/icons/outline/train.svg';
import CreditCardHeartOutline from '../../assets/icons/outline/credit_card_heart.svg';

// Custom SVG Icons - Fill
import HomeFill from '../../assets/icons/fill/home.svg';
import ConfirmationNumberFill from '../../assets/icons/fill/confirmation_number.svg';
import SearchFill from '../../assets/icons/fill/search.svg';
import TrainFill from '../../assets/icons/fill/train.svg';
import CreditCardHeartFill from '../../assets/icons/fill/credit_card_heart.svg';

import glyphMapOutlined from '../../assets/fonts/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].json';
import glyphMapRounded from '../../assets/fonts/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].json';
import glyphMapSharp from '../../assets/fonts/MaterialSymbolsSharp[FILL,GRAD,opsz,wght].json';

export type MaterialSymbolStyle = 'outlined' | 'rounded' | 'sharp';

export interface IconProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: -25 | 0 | 200;
  style?: TextStyle;
  type?: MaterialSymbolStyle;
  className?: string;
}

const customIcons: Record<string, { outline: React.FC<SvgProps>; fill: React.FC<SvgProps> }> = {
  home: { outline: HomeOutline, fill: HomeFill },
  confirmation_number: { outline: ConfirmationNumberOutline, fill: ConfirmationNumberFill },
  search: { outline: SearchOutline, fill: SearchFill },
  train: { outline: TrainOutline, fill: TrainFill },
  credit_card_heart: { outline: CreditCardHeartOutline, fill: CreditCardHeartFill },
};

const glyphMaps = {
  outlined: glyphMapOutlined,
  rounded: glyphMapRounded,
  sharp: glyphMapSharp,
};

const fontFamiliesByWeight = {
  100: 'MaterialSymbols_100Thin',
  200: 'MaterialSymbols_200ExtraLight',
  300: 'MaterialSymbols_300Light',
  400: 'MaterialSymbols_400Regular',
  500: 'MaterialSymbols_500Medium',
  600: 'MaterialSymbols_600SemiBold',
  700: 'MaterialSymbols_700Bold',
};

export const Icon = ({
  name,
  size = 24,
  color,
  fill = false,
  weight = 400,
  grade = 0,
  style,
  type = 'rounded',
  className,
  ...props
}: IconProps) => {
  // Check if it's a custom SVG icon
  const customIcon = customIcons[name];
  if (customIcon) {
    const SvgIcon = fill ? customIcon.fill : customIcon.outline;
    return (
      <SvgIcon
        width={size}
        height={size}
        color={color}
        fill={color} // Material SVGs usually use fill for color
        className={className}
        style={style as any}
      />
    );
  }

  // Fallback to Font Icon
  const glyphMap = glyphMaps[type];
  const glyph = (glyphMap as any)[name];

  if (!glyph) {
    console.warn(`Icon "${name}" not found in custom set or font sets`);
    return null;
  }

  const char = String.fromCharCode(glyph);
  const fontFamily = (fontFamiliesByWeight as any)[weight] || 'MaterialSymbols_400Regular';

  return (
    <Text
      className={`text-center ${className || ''}`}
      style={[
        {
          fontFamily,
          fontSize: size,
          color,
          includeFontPadding: false,
        },
        style,
      ]}
      {...props}
    >
      {char}
    </Text>
  );
};

export default Icon;
