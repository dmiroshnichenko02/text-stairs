import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Check } from 'lucide-react'

interface PricingPlansProps {
	period: 'weekly' | 'monthly'
}

export function PricingPlans({ period }: PricingPlansProps) {
	const pricing = {
		weekly: {
			basic: {
				price: '99₴',
				features: [
					'5 аналізів книг на тиждень',
					'Базові типи аналізу',
					'Експорт у PDF',
					'Підтримка електронною поштою',
				],
			},
			pro: {
				price: '199₴',
				features: [
					'15 аналізів книг на тиждень',
					'Усі типи аналізу',
					'Експорт у PDF та DOCX',
					'Пріоритетна підтримка',
					'Чат з книгою (100 повідомлень)',
				],
			},
			unlimited: {
				price: '349₴',
				features: [
					'Необмежена кількість аналізів',
					'Усі типи аналізу',
					'Експорт у всіх форматах',
					'Пріоритетна підтримка 24/7',
					'Необмежений чат з книгою',
					'API доступ',
				],
			},
		},
		monthly: {
			basic: {
				price: '299₴',
				features: [
					'20 аналізів книг на місяць',
					'Базові типи аналізу',
					'Експорт у PDF',
					'Підтримка електронною поштою',
				],
			},
			pro: {
				price: '599₴',
				features: [
					'60 аналізів книг на місяць',
					'Усі типи аналізу',
					'Експорт у PDF та DOCX',
					'Пріоритетна підтримка',
					'Чат з книгою (500 повідомлень)',
				],
			},
			unlimited: {
				price: '999₴',
				features: [
					'Необмежена кількість аналізів',
					'Усі типи аналізу',
					'Експорт у всіх форматах',
					'Пріоритетна підтримка 24/7',
					'Необмежений чат з книгою',
					'API доступ',
				],
			},
		},
	}

	const currentPricing = pricing[period]

	return (
		<div className='grid gap-6 md:grid-cols-3'>
			<Card className='border-gray-200'>
				<CardHeader>
					<CardTitle>Базовий</CardTitle>
					<CardDescription>Для особистого використання</CardDescription>
					<div className='mt-4'>
						<span className='text-3xl font-bold'>
							{currentPricing.basic.price}
						</span>
						<span className='text-gray-500 ml-1'>
							/{period === 'weekly' ? 'тиждень' : 'місяць'}
						</span>
					</div>
				</CardHeader>
				<CardContent>
					<ul className='space-y-2 text-sm'>
						{currentPricing.basic.features.map((feature, index) => (
							<li key={index} className='flex items-center'>
								<Check className='w-4 h-4 mr-2 text-emerald-600' />
								{feature}
							</li>
						))}
					</ul>
				</CardContent>
				<CardFooter>
					<Button className='w-full bg-emerald-600 hover:bg-emerald-700'>
						Обрати план
					</Button>
				</CardFooter>
			</Card>

			<Card className='border-emerald-200 shadow-lg relative'>
				<div className='absolute top-0 right-0 -translate-y-1/2 bg-emerald-600 text-white px-3 py-1 text-xs font-medium rounded-full'>
					Популярний
				</div>
				<CardHeader>
					<CardTitle>Професійний</CardTitle>
					<CardDescription>Для студентів та викладачів</CardDescription>
					<div className='mt-4'>
						<span className='text-3xl font-bold'>
							{currentPricing.pro.price}
						</span>
						<span className='text-gray-500 ml-1'>
							/{period === 'weekly' ? 'тиждень' : 'місяць'}
						</span>
					</div>
				</CardHeader>
				<CardContent>
					<ul className='space-y-2 text-sm'>
						{currentPricing.pro.features.map((feature, index) => (
							<li key={index} className='flex items-center'>
								<Check className='w-4 h-4 mr-2 text-emerald-600' />
								{feature}
							</li>
						))}
					</ul>
				</CardContent>
				<CardFooter>
					<Button className='w-full bg-emerald-600 hover:bg-emerald-700'>
						Обрати план
					</Button>
				</CardFooter>
			</Card>

			<Card className='border-gray-200'>
				<CardHeader>
					<CardTitle>Необмежений</CardTitle>
					<CardDescription>
						Для організацій та інтенсивного використання
					</CardDescription>
					<div className='mt-4'>
						<span className='text-3xl font-bold'>
							{currentPricing.unlimited.price}
						</span>
						<span className='text-gray-500 ml-1'>
							/{period === 'weekly' ? 'тиждень' : 'місяць'}
						</span>
					</div>
				</CardHeader>
				<CardContent>
					<ul className='space-y-2 text-sm'>
						{currentPricing.unlimited.features.map((feature, index) => (
							<li key={index} className='flex items-center'>
								<Check className='w-4 h-4 mr-2 text-emerald-600' />
								{feature}
							</li>
						))}
					</ul>
				</CardContent>
				<CardFooter>
					<Button className='w-full bg-emerald-600 hover:bg-emerald-700'>
						Обрати план
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
