import { Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const textColor = useThemeColor(
    { light: lightColor },
    "text",
  );
  const typeClassName = {
    default: "text-base leading-6 font-plus-jakarta",
    defaultSemiBold: "text-base leading-6 font-plus-jakarta-semibold",
    title: "text-3xl leading-9 font-plus-jakarta-bold",
    subtitle: "text-xl font-plus-jakarta-bold",
    link: "text-base leading-7 !text-cyan-700 font-plus-jakarta",
  }[type];

  return (
    <Text
      className={typeClassName}
      style={[type !== "link" ? { color: textColor } : undefined, style]}
      {...rest}
    />
  );
}
