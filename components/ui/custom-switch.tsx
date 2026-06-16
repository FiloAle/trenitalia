import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (val: boolean) => void;
    activeColor?: string;
    inactiveColor?: string;
}

export function CustomSwitch({ 
    value, 
    onValueChange, 
    activeColor = "#134e4a", 
    inactiveColor = "#9ca3af" 
}: CustomSwitchProps) {
    const trackStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                withTiming(value ? 1 : 0, { duration: 200 }),
                [0, 1],
                [inactiveColor, activeColor]
            )
        };
    });

    const thumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: withTiming(value ? 20 : 0, { duration: 200 }) }]
        };
    });

    return (
        <Pressable onPress={() => onValueChange(!value)}>
            <Animated.View 
                style={[
                    trackStyle, 
                    { width: 50, height: 30, borderRadius: 15, justifyContent: "center", paddingHorizontal: 2 }
                ]}
            >
                <Animated.View 
                    style={[
                        thumbStyle, 
                        { width: 26, height: 26, borderRadius: 13, backgroundColor: "white", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2.5, elevation: 2 }
                    ]}
                />
            </Animated.View>
        </Pressable>
    );
}
