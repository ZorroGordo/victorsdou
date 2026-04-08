import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { GTMScript, GTMNoScript } from '@/components/analytics/GTMScript'

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GTMNoScript />
      <GTMScript />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
