import { ThemedText } from "@/components/themed-text";
import React from "react";

interface SectionHeaderProps {
	title: string;
	className?: string;
}

export function SectionHeader({ title, className = "" }: SectionHeaderProps) {
	return (
		<ThemedText
			className={`text-[14px] font-plus-jakarta-medium uppercase tracking-wider !text-gray-500 mb-1 ${className}`}
		>
			{title}
		</ThemedText>
	);
}
