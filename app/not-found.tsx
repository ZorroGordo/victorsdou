import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-6xl font-serif text-green mb-4">404</p>
        <h1 className="text-2xl font-serif text-charcoal mb-4">Página no encontrada</h1>
        <p className="text-charcoal/70 mb-8">
          Lo sentimos, no pudimos encontrar la página que buscas. Puede que haya sido movida o ya no exista.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-green text-white px-6 py-3 rounded-lg text-sm font-medium uppercase tracking-wide hover:bg-green/90 transition-colors"
          >
            Ir al Inicio
          </Link>
          <Link
            href="/tienda"
            className="bg-white text-charcoal px-6 py-3 rounded-lg text-sm font-medium uppercase tracking-wide border border-charcoal/20 hover:border-charcoal/40 transition-colors"
          >
            Ver Tienda
          </Link>
        </div>
      </div>
    </div>
  )
}
