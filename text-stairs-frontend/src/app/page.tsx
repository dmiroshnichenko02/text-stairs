import { BookAnalysis } from '@/components/book-analysis'
import { BookUpload } from '@/components/book-upload'
import { Features } from '@/components/features'
import { PricingPlans } from '@/components/pricing-plans'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
	return (
		<div className='flex flex-col min-h-screen'>
			<main className='flex-1'>
				<BackgroundBeamsWithCollision>
					<section className='py-12 md:py-24 bg-gradient-to-b from-white to-emerald-50'>
						<div className='container px-4 mx-auto md:px-6'>
							<div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
								<div className='space-y-4'>
									<h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
										Розкрийте потенціал книг з TextStairs
									</h1>
									<p className='max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
										Завантажуйте книги та отримуйте глибокий аналіз: питання,
										короткий зміст, цитати, аналіз персонажів та багато іншого.
									</p>
									<div className='flex flex-col gap-2 min-[400px]:flex-row'>
										<Button className='bg-emerald-600 hover:bg-emerald-700'>
											Спробувати безкоштовно
										</Button>
										<Button variant='outline'>Дізнатися більше</Button>
									</div>
								</div>
								<div className='mx-auto lg:ml-auto z-50'>
									<Card className='border-emerald-200 shadow-lg'>
										<CardHeader className='pb-4'>
											<CardTitle>Аналіз книги</CardTitle>
											<CardDescription>
												Завантажте книгу та оберіть тип аналізу
											</CardDescription>
										</CardHeader>
										<CardContent>
											<BookUpload />
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</section>
				</BackgroundBeamsWithCollision>

				<section id='features' className='py-12 md:py-24'>
					<div className='container mx-auto px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<div className='inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700'>
									Можливості
								</div>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
									Що може TextStairs?
								</h2>
								<p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Наша платформа пропонує широкий спектр інструментів для
									аналізу книг та текстів
								</p>
							</div>
						</div>
						<Features />
					</div>
				</section>

				<section id='demo' className='py-12 md:py-24 bg-gray-50'>
					<div className='container mx-auto px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
									Спробуйте демо
								</h2>
								<p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Перегляньте, як працює TextStairs на прикладі
								</p>
							</div>
						</div>
						<div className='mx-auto max-w-4xl py-12'>
							<BookAnalysis />
						</div>
					</div>
				</section>

				<section id='pricing' className='py-12 md:py-24'>
					<div className='container mx-auto px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<div className='inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700'>
									Тарифи
								</div>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
									Оберіть свій план
								</h2>
								<p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Гнучкі тарифи для різних потреб з можливістю тижневої та
									місячної оплати
								</p>
							</div>
						</div>
						<div className='mx-auto max-w-5xl py-12'>
							<Tabs defaultValue='weekly' className='w-full'>
								<div className='flex justify-center mb-8'>
									<TabsList>
										<TabsTrigger value='weekly'>Тижневі</TabsTrigger>
										<TabsTrigger value='monthly'>Місячні</TabsTrigger>
									</TabsList>
								</div>
								<TabsContent value='weekly'>
									<PricingPlans period='weekly' />
								</TabsContent>
								<TabsContent value='monthly'>
									<PricingPlans period='monthly' />
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
