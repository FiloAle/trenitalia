import React from 'react';
import { View, ScrollView, Text, Image } from 'react-native';

const createAnimatedComponent = (Component: any) => {
  return React.forwardRef(({ entering, exiting, layout, sharedTransitionTag, style, ...props }: any, ref) => {
    return <Component ref={ref} style={style} {...props} />;
  });
};

const Animated = {
  View: createAnimatedComponent(View),
  ScrollView: createAnimatedComponent(ScrollView),
  Text: createAnimatedComponent(Text),
  Image: createAnimatedComponent(Image),
  createAnimatedComponent,
};

export const useAnimatedStyle = (fn: any) => fn();
export const useSharedValue = (initialValue: any) => ({ value: initialValue });
export const withTiming = (val: any) => val;
export const withRepeat = (val: any) => val;
export const withSequence = (...args: any[]) => args[args.length - 1];

export const interpolateColor = (val: any, input: any[], output: any[]) => {
  if (val === input[0]) return output[0];
  if (val === input[1]) return output[1];
  return output[0];
};

export const interpolate = (val: any, input: any[], output: any[]) => {
  if (val === input[0]) return output[0];
  if (val === input[1]) return output[1];
  return output[0];
};

export const useAnimatedRef = () => React.useRef(null);
export const useScrollViewOffset = () => ({ value: 0 });
export const useScrollOffset = () => ({ value: 0 });
export const Extrapolation = { CLAMP: 'clamp', IDENTITY: 'identity', EXTEND: 'extend' };

export const FadeIn = null;
export const FadeOut = null;
export const FadeInDown = null;
export const SlideInUp = null;
export const SlideOutUp = null;
export const SlideInDown = null;
export const SlideOutDown = null;

const DummyTransition = {
  springify: () => DummyTransition,
  damping: () => DummyTransition,
  stiffness: () => DummyTransition,
  duration: () => DummyTransition,
  mass: () => DummyTransition,
  overshootClamping: () => DummyTransition,
  restDisplacementThreshold: () => DummyTransition,
  restSpeedThreshold: () => DummyTransition,
};

export const LinearTransition = DummyTransition;
export const Layout = DummyTransition;

export default Animated;
