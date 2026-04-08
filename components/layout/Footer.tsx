import Link from 'next/link'
import Image from 'next/image'

const nosotrosLinks = [
  { name: 'Nuestra historia', href: '/nosotros' },
  { name: 'Recetas', href: '/recetas' },
  { name: 'Blog', href: '/blog' },
  { name: 'Tienda', href: '/tienda' },
  { name: 'Contacto', href: '/contacto' },
]

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/victorsdou' },
  { name: 'Facebook', href: 'https://facebook.com/victorsdou' },
  { name: 'Tiktok', href: 'https://tiktok.com/@victorsdou' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="bg-charcoal text-cream-100"
      role="contentinfo"
      aria-label="Pie de página"
    >
      {/* Main Footer */}
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-flex items-center mb-6">
              <Image
                src="/images/logo.svg"
                alt="@victorsdou"
                width={238}
                height={41}
                className="h-10 w-auto"
              />
            </Link>

            {/* Google Maps Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-yellow-400/60'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-cream-300 text-sm ml-1">4.7</span>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/victorsdou"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cream-400 hover:text-green transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0Z" fill="#4285F4"/>
                <circle cx="12" cy="8.5" r="3.5" fill="white"/>
              </svg>
              Ver en Google Maps
            </a>
          </div>

          {/* Nosotros Column */}
          <div>
            <h3 className="font-semibold text-cream-50 uppercase tracking-wider text-sm mb-6">
              Nosotros
            </h3>
            <ul className="space-y-3" role="list">
              {nosotrosLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-400 hover:text-green transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="font-semibold text-cream-50 uppercase tracking-wider text-sm mb-6">
              Social
            </h3>
            <ul className="space-y-3" role="list">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cream-400 hover:text-green transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal-light">
        <div className="container-main py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-cream-400">
              © {currentYear} @victorsdou | Victor Dou SAC | RUC: 20606963123. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-xs text-cream-400">
              <Link href="/privacidad" className="hover:text-green transition-colors">
                Políticas de privacidad
              </Link>
              <Link href="/terminos" className="hover:text-green transition-colors">
                Términos y condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
