interface TextProps {
	text: string;
	variant: 'h1' | 'h2' | undefined;
	color?: 'black' | 'gray' | 'white';
	marginBottom?: number;
	className?: string;
}

const Text = (props: TextProps) => {
	const text =
		props.color === 'black'
			? 'text-gray-800'
			: props.color === 'gray'
			? 'text-gray-600'
			: props.color === 'white'
			? 'text-white'
			: 'text-purple-900';
	if (props.variant === 'h1') {
		return (
			<h1
				className={`text-2xl font-semibold tracking-wide mb-${
					props.marginBottom ?? '0'
				} ${text} ${props.className}`}
			>
				{props.text}
			</h1>
		);
	}
	if (props.variant === 'h2') {
		return (
			<h2
				className={`text-xl font-semibold tracking-wide mb-${
					props.marginBottom ?? '0'
				} ${text} ${props.className}`}
			>
				{props.text}
			</h2>
		);
	}
	return null;
};

export default Text;
