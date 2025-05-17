import { FC, PropsWithChildren } from 'react'
import Footer from './Footer'
import Header from './Header'

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	)
}

export default Layout
