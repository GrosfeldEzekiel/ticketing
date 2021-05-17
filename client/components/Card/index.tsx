import { ReactNode } from 'react';

export interface CardProps {
	header?: ReactNode;
	content: ReactNode;
	footer?: ReactNode;
	className?: string;
}

const Card = (props: CardProps) => {
	return (
		<div className={`rouned-lg shadow-lg hover:shadow-2xl ${props.className}`}>
			<div className="p-3">{props.header}</div>
			<div className="p-3">{props.content}</div>
			<div className="p-3">{props.footer}</div>
		</div>
	);
};

export default Card;
