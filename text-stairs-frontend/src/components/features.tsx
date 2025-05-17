import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	BookText,
	FileQuestion,
	GraduationCap,
	MessageSquare,
	Quote,
	Users,
} from 'lucide-react'

export function Features() {
	return (
		<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8'>
			<Card>
				<CardHeader className='pb-2'>
					<BookText className='w-10 h-10 text-emerald-600 mb-2' />
					<CardTitle>Короткий зміст</CardTitle>
					<CardDescription>
						Отримайте стислий виклад основних подій та ідей книги
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-gray-500'>
						Економте час на читанні, отримуючи ключові моменти та ідеї в
						компактному форматі. Ідеально для підготовки до занять або швидкого
						ознай омлення з твором.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='pb-2'>
					<FileQuestion className='w-10 h-10 text-emerald-600 mb-2' />
					<CardTitle>Питання до тексту</CardTitle>
					<CardDescription>
						Генерація питань різного рівня складності
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-gray-500'>
						Отримайте набір аналітичних, дискусійних та фактологічних питань для
						глибшого розуміння тексту, підготовки до іспитів або організації
						обговорень.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='pb-2'>
					<Quote className='w-10 h-10 text-emerald-600 mb-2' />
					<CardTitle>Цитати</CardTitle>
					<CardDescription>
						Вибірка найважливіших та найяскравіших цитат
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-gray-500'>
						Знаходьте ключові цитати для використання в есе, презентаціях або
						для особистого натхнення. Кожна цитата супроводжується контекстом та
						поясненням.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='pb-2'>
					<Users className='w-10 h-10 text-emerald-600 mb-2' />
					<CardTitle>Аналіз персонажів</CardTitle>
					<CardDescription>
						Детальний розбір головних та другорядних персонажів
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-gray-500'>
						Отримайте глибокий аналіз мотивацій, розвитку та символічного
						значення персонажів, їх взаємовідносин та ролі в сюжеті.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='pb-2'>
					<GraduationCap className='w-10 h-10 text-emerald-600 mb-2' />
					<CardTitle>Академічний аналіз</CardTitle>
					<CardDescription>
						Професійний літературний аналіз для навчальних цілей
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-gray-500'>
						Отримайте структурований аналіз літературних прийомів, тем,
						символіки та контексту твору для академічних робіт та досліджень.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='pb-2'>
					<MessageSquare className='w-10 h-10 text-emerald-600 mb-2' />
					<CardTitle>Чат з книгою</CardTitle>
					<CardDescription>
						Задавайте питання та отримуйте відповіді на основі тексту
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-gray-500'>
						Взаємодійте з книгою через інтерактивний чат, задаючи питання та
						отримуючи відповіді, засновані на змісті та контексті твору.
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
