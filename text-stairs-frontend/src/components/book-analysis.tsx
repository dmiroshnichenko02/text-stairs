'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	BookOpen,
	Copy,
	Download,
	MessageSquare,
	Quote,
	Users,
} from 'lucide-react'
import { useState } from 'react'

export function BookAnalysis() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [copied, setCopied] = useState(false)

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Card className='border-emerald-200'>
			<CardContent className='p-6'>
				<div className='flex items-center justify-between mb-6'>
					<div className='flex items-center gap-3'>
						<BookOpen className='w-6 h-6 text-emerald-600' />
						<div>
							<h3 className='font-semibold'>
								Гаррі Поттер і філософський камінь
							</h3>
							<p className='text-sm text-gray-500'>Дж. К. Роулінг</p>
						</div>
					</div>
					<Button variant='outline' size='sm'>
						<Download className='w-4 h-4 mr-2' />
						Завантажити аналіз
					</Button>
				</div>

				<Tabs defaultValue='summary'>
					<TabsList className='grid grid-cols-4 mb-6'>
						<TabsTrigger value='summary'>Короткий зміст</TabsTrigger>
						<TabsTrigger value='questions'>Питання</TabsTrigger>
						<TabsTrigger value='quotes'>Цитати</TabsTrigger>
						<TabsTrigger value='characters'>Персонажі</TabsTrigger>
					</TabsList>

					<TabsContent value='summary' className='space-y-4'>
						<div className='relative p-4 bg-gray-50 rounded-lg'>
							<Button
								variant='ghost'
								size='icon'
								className='absolute top-2 right-2'
								onClick={() =>
									handleCopy(
										'Гаррі Поттер — хлопчик-сирота, який живе з тіткою Петунією, дядьком Верноном та їхнім сином Дадлі. На свій одинадцятий день народження Гаррі дізнається, що він чарівник і його запрошують навчатися в Гоґвортсі, школі чарівництва та чаклунства. Там він знайомиться з Роном Візлі та Герміоною Ґрейнджер, дізнається про свою славу в чарівному світі та про те, що його батьків вбив темний чарівник Волдеморт. Протягом навчального року Гаррі та його друзі розкривають таємницю філософського каменя, який може дарувати безсмертя, і запобігають його крадіжці Волдемортом.'
									)
								}
							>
								<Copy className='h-4 w-4' />
								<span className='sr-only'>Копіювати</span>
							</Button>
							<p>
								Гаррі Поттер — хлопчик-сирота, який живе з тіткою Петунією,
								дядьком Верноном та їхнім сином Дадлі. На свій одинадцятий день
								народження Гаррі дізнається, що він чарівник і його запрошують
								навчатися в Гоґвортсі, школі чарівництва та чаклунства. Там він
								знайомиться з Роном Візлі та Герміоною Ґрейнджер, дізнається про
								свою славу в чарівному світі та про те, що його батьків вбив
								темний чарівник Волдеморт. Протягом навчального року Гаррі та
								його друзі розкривають таємницю філософського каменя, який може
								дарувати безсмертя, і запобігають його крадіжці Волдемортом.
							</p>
						</div>
						<div className='p-4 bg-emerald-50 rounded-lg border border-emerald-100'>
							<h4 className='font-medium mb-2 text-emerald-800'>
								Ключові моменти:
							</h4>
							<ul className='list-disc pl-5 space-y-1 text-emerald-700'>
								<li>Відкриття Гаррі свого чарівного походження</li>
								<li>Прибуття до Гоґвортсу та розподіл на факультети</li>
								<li>Формування дружби з Роном та Герміоною</li>
								<li>Протистояння з професором Снейпом</li>
								<li>Квідич та перша перемога Гаррі</li>
								<li>Розкриття таємниці філософського каменя</li>
								<li>Зустріч з Волдемортом та перемога над ним</li>
							</ul>
						</div>
					</TabsContent>

					<TabsContent value='questions' className='space-y-4'>
						<div className='grid gap-4'>
							<Card className='border-emerald-200'>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<MessageSquare className='w-5 h-5 text-emerald-600 mt-0.5' />
										<div>
											<h4 className='font-medium'>
												Які основні теми розкриваються в книзі &quot;Гаррі
												Поттер і філософський камінь&quot;?
											</h4>
											<p className='text-sm text-gray-500 mt-1'>
												Проаналізуйте основні теми, такі як дружба, мужність,
												вибір між добром і злом, та їх розвиток протягом книги.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='border-emerald-200'>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<MessageSquare className='w-5 h-5 text-emerald-600 mt-0.5' />
										<div>
											<h4 className='font-medium'>
												Як образ Гаррі Поттера еволюціонує від початку до кінця
												книги?
											</h4>
											<p className='text-sm text-gray-500 mt-1'>
												Опишіть зміни в характері та світогляді головного героя,
												його адаптацію до нового світу та прийняття своєї ролі.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='border-emerald-200'>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<MessageSquare className='w-5 h-5 text-emerald-600 mt-0.5' />
										<div>
											<h4 className='font-medium'>
												Яку роль відіграє дзеркало Яцрес у розвитку сюжету та
												характеру Гаррі?
											</h4>
											<p className='text-sm text-gray-500 mt-1'>
												Проаналізуйте символічне значення дзеркала, його вплив
												на Гаррі та зв&apos;язок з основними темами твору.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value='quotes' className='space-y-4'>
						<div className='grid gap-4'>
							<Card className='border-emerald-200'>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<Quote className='w-5 h-5 text-emerald-600 mt-0.5' />
										<div>
											<p className='italic'>
												&quot;Не варто зациклюватися на мріях і забувати
												жити.&quot;
											</p>
											<p className='text-sm text-gray-500 mt-1'>
												— Албус Дамблдор
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='border-emerald-200'>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<Quote className='w-5 h-5 text-emerald-600 mt-0.5' />
										<div>
											<p className='italic'>
												&quot;Страх перед іменем лише збільшує страх перед самою
												річчю.&quot;
											</p>
											<p className='text-sm text-gray-500 mt-1'>
												— Герміона Ґрейнджер
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='border-emerald-200'>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<Quote className='w-5 h-5 text-emerald-600 mt-0.5' />
										<div>
											<p className='italic'>
												&quot;Для добре організованого розуму смерть — це лише
												наступна велика пригода.&quot;
											</p>
											<p className='text-sm text-gray-500 mt-1'>
												— Албус Дамблдор
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value='characters' className='space-y-4'>
						<div className='grid gap-4'>
							<Card className='border-emerald-200'>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<Users className='w-5 h-5 text-emerald-600 mt-0.5' />
										<div>
											<h4 className='font-medium'>Гаррі Поттер</h4>
											<p className='text-sm text-gray-600 mt-1'>
												Головний герой, хлопчик-сирота з блискавкоподібним
												шрамом на чолі. Дізнається, що він чарівник і вступає до
												Гоґвортсу. Хоробрий, лояльний, іноді імпульсивний.
												Належить до факультету Ґрифіндор.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='border-emerald-200'>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<Users className='w-5 h-5 text-emerald-600 mt-0.5' />
										<div>
											<h4 className='font-medium'>Рон Візлі</h4>
											<p className='text-sm text-gray-600 mt-1'>
												Найкращий друг Гаррі, походить з великої чаклунської
												родини. Часто почувається в тіні своїх старших братів.
												Лояльний, з почуттям гумору, але іноді невпевнений у
												собі. Належить до факультету Ґрифіндор.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='border-emerald-200'>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<Users className='w-5 h-5 text-emerald-600 mt-0.5' />
										<div>
											<h4 className='font-medium'>Герміона Ґрейнджер</h4>
											<p className='text-sm text-gray-600 mt-1'>
												Подруга Гаррі та Рона, народжена в сім&apos;ї маґлів.
												Надзвичайно розумна, старанна і принципова. Спочатку
												здається зарозумілою, але згодом стає незамінною
												частиною тріо друзів. Належить до факультету Ґрифіндор.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
