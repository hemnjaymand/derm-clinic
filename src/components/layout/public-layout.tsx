import Footer from "react-multi-date-picker/plugins/range_picker_footer"
import { Header } from "../shared"



interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header   />
      <main className="flex-1 container py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  )
}