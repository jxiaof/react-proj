import { Lightbulb, Target, Zap, Brain } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';

const values = [
	{
		id: 'be-real',
		title: '极致求真',
		subtitle: 'Be Real',
		description: '坚持诚实对待每一个产品决策，从真实用户反馈出发，拒绝自欺欺人的假象。',
		icon: Lightbulb,
		gradient: 'from-green-400 to-green-500',
		color: 'green',
	},
	{
		id: 'show-evidence',
		title: '实事求是',
		subtitle: 'Show Evidence',
		description: '用数据说话，每个决策都有明确的证据支撑。相信事实，而非猜测。',
		icon: Target,
		gradient: 'from-blue-400 to-blue-500',
		color: 'blue',
	},
	{
		id: 'first-principles',
		title: '本质思考',
		subtitle: 'Think from First Principles',
		description: '从根本问题出发，突破常规思维的束缚，探寻事物的本质规律。',
		icon: Brain,
		gradient: 'from-purple-400 to-purple-500',
		color: 'purple',
	},
	{
		id: 'ai-native',
		title: 'AI 原生',
		subtitle: 'AI by Default',
		description: '以 AI 为核心驱动力，打造下一代智能应用，让 AI 能力融入每个业务决策。',
		icon: Zap,
		gradient: 'from-orange-400 to-orange-500',
		color: 'orange',
	},
];

export function CultureValues() {
	return (
		<section className="space-y-10 md:space-y-12 py-12 md:py-16 animate-fadeInUp">
			<div className="text-center space-y-3 md:space-y-4">
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">企业文化</h2>
				<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
					我们是一家 AI-native 的公司，坚持从第一性原理出发思考问题。在这里，进化是唯一的常态。
				</p>
			</div>

			<div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
				{values.map((value, idx) => {
					const Icon = value.icon;
					return (
						<Card
							key={value.id}
							className="group hover:shadow-enhance transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scaleIn relative"
						>
							{/* Gradient background overlay */}
							<div
								className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full blur-3xl -mr-20 -mt-20`}
							/>

							<CardContent className="p-5 md:p-6 relative">
								{/* Icon with gradient background */}
								<div
									className={`h-12 w-12 rounded-lg bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
								>
									<Icon className="h-6 w-6 text-white" />
								</div>

								{/* Title */}
								<h3 className="text-base md:text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
									{value.title}
								</h3>

								{/* Subtitle */}
								<p className="text-xs md:text-sm font-medium text-primary mb-3">
									{value.subtitle}
								</p>

								{/* Description */}
								<p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4 group-hover:text-muted-foreground/80 transition-colors">
									{value.description}
								</p>

								{/* Accent line */}
								<div
									className={`h-0.5 w-0 bg-gradient-to-r ${value.gradient} group-hover:w-full transition-all duration-300`}
								/>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Tagline */}
			<div className="text-center pt-6 md:pt-10 animate-fadeInUp">
				<p className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
					持续进化：
					<span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent ml-2">
						Always Learning, Never Stop Evolving
					</span>
				</p>
			</div>
		</section>
	);
}
