/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },
  async redirects() {
    return [
      // Old WordPress blog URLs → matching new blog posts or /blog
      { source: '/blog/semillas-girasol-linaza-ajonjoli-propiedades/', destination: '/blog-tipos-harina-masa-madre', permanent: true },
      { source: '/blog/semillas-girasol-linaza-ajonjoli-propiedades', destination: '/blog-tipos-harina-masa-madre', permanent: true },
      { source: '/blog/www-victorsdou-com-blog-masamadre-beneficios-propiedades/', destination: '/blog-masa-madre-salud-digestiva', permanent: true },
      { source: '/blog/www-victorsdou-com-blog-masamadre-beneficios-propiedades', destination: '/blog-masa-madre-salud-digestiva', permanent: true },
      { source: '/blog/diferencia-uso-masa-madre-pan-convencional/', destination: '/blog-masa-madre-vs-pan-industrial', permanent: true },
      { source: '/blog/diferencia-uso-masa-madre-pan-convencional', destination: '/blog-masa-madre-vs-pan-industrial', permanent: true },
      { source: '/blog/razones-para-consumir-pan-de-masa-madre/', destination: '/blog-masa-madre-salud-digestiva', permanent: true },
      { source: '/blog/razones-para-consumir-pan-de-masa-madre', destination: '/blog-masa-madre-salud-digestiva', permanent: true },
      { source: '/blog/como-tener-un-estilo-de-vida-saludable-y-tips-para-lograrlo/', destination: '/blog', permanent: true },
      { source: '/blog/como-tener-un-estilo-de-vida-saludable-y-tips-para-lograrlo', destination: '/blog', permanent: true },
      { source: '/blog/las-semillas-y-sus-propiedades/', destination: '/blog-granos-andinos-masa-madre', permanent: true },
      { source: '/blog/las-semillas-y-sus-propiedades', destination: '/blog-granos-andinos-masa-madre', permanent: true },
      { source: '/blog/cuales-son-las-diferencias-entre-la-masa-madre-y-el-pan-convencional/', destination: '/blog-masa-madre-vs-pan-industrial', permanent: true },
      { source: '/blog/cuales-son-las-diferencias-entre-la-masa-madre-y-el-pan-convencional', destination: '/blog-masa-madre-vs-pan-industrial', permanent: true },
      // Catch-all for any other old /blog/ WordPress URLs
      { source: '/blog/:slug/', destination: '/blog', permanent: true },

      // Old WordPress product URLs → matching current products or /tienda
      { source: '/product/panettone/', destination: '/tienda', permanent: true },
      { source: '/product/panettone', destination: '/tienda', permanent: true },
      { source: '/product/pan-masa-madre-semilla/', destination: '/tienda/PT-PANMULTIGRAN750', permanent: true },
      { source: '/product/pan-masa-madre-semilla', destination: '/tienda/PT-PANMULTIGRAN750', permanent: true },
      { source: '/product/multigrain-loaf/', destination: '/tienda/PT-PANMULTIGRAN750', permanent: true },
      { source: '/product/multigrain-loaf', destination: '/tienda/PT-PANMULTIGRAN750', permanent: true },
      { source: '/product/pan-de-mie/', destination: '/tienda/PT-PAINDEMIE890PT', permanent: true },
      { source: '/product/pan-de-mie', destination: '/tienda/PT-PAINDEMIE890PT', permanent: true },
      { source: '/product/pan-campesino-masa-madre/', destination: '/tienda/PT-PANCAMPESINO800', permanent: true },
      { source: '/product/pan-campesino-masa-madre', destination: '/tienda/PT-PANCAMPESINO800', permanent: true },
      { source: '/product/pizza-dough/', destination: '/tienda', permanent: true },
      { source: '/product/pizza-dough', destination: '/tienda', permanent: true },
      { source: '/product/focaccia/', destination: '/tienda', permanent: true },
      { source: '/product/focaccia', destination: '/tienda', permanent: true },
      { source: '/product/seeded-sandwich/', destination: '/tienda/PT-SEEDEDSANDWICH90', permanent: true },
      { source: '/product/seeded-sandwich', destination: '/tienda/PT-SEEDEDSANDWICH90', permanent: true },
      { source: '/product/suscripcion-mensual-basica/', destination: '/tienda', permanent: true },
      { source: '/product/suscripcion-mensual-basica', destination: '/tienda', permanent: true },
      // Catch-all for any other old /product/ URLs
      { source: '/product/:slug/', destination: '/tienda', permanent: true },
      { source: '/product/:slug', destination: '/tienda', permanent: true },

      // Old WordPress shop & category URLs → /tienda
      { source: '/shop/', destination: '/tienda', permanent: true },
      { source: '/shop', destination: '/tienda', permanent: true },
      { source: '/product-category/:slug/', destination: '/tienda', permanent: true },
      { source: '/product-category/:slug', destination: '/tienda', permanent: true },

      // Old WordPress recipe URLs → /recetas
      { source: '/recetas/focaccia-jamon-y-burrata/', destination: '/recetas', permanent: true },
      { source: '/recetas/focaccia-jamon-y-burrata', destination: '/recetas', permanent: true },
      { source: '/recetas/focaccia-prosciutto/', destination: '/recetas', permanent: true },
      { source: '/recetas/focaccia-prosciutto', destination: '/recetas', permanent: true },
      { source: '/recetas/cacio-e-pepe-scrambled-eggs-toast/', destination: '/recetas', permanent: true },
      { source: '/recetas/cacio-e-pepe-scrambled-eggs-toast', destination: '/recetas', permanent: true },
      { source: '/recetas/mixto-baguette/', destination: '/recetas', permanent: true },
      { source: '/recetas/mixto-baguette', destination: '/recetas', permanent: true },
      { source: '/recetas/pollo-desmenuzado-palta-seeded-sandwich/', destination: '/recetas', permanent: true },
      { source: '/recetas/pollo-desmenuzado-palta-seeded-sandwich', destination: '/recetas', permanent: true },
      { source: '/recetas/sandwich-de-costillas/', destination: '/recetas', permanent: true },
      { source: '/recetas/sandwich-de-costillas', destination: '/recetas', permanent: true },
      { source: '/recetas/pizza-margherita/', destination: '/recetas', permanent: true },
      { source: '/recetas/pizza-margherita', destination: '/recetas', permanent: true },
      // Catch-all for any other old /recetas/ sub-URLs
      { source: '/recetas/:slug/', destination: '/recetas', permanent: true },

      // Old English URLs → Spanish equivalents
      { source: '/en/home-en/', destination: '/', permanent: true },
      { source: '/en/home-en', destination: '/', permanent: true },
      { source: '/en/shop/', destination: '/tienda', permanent: true },
      { source: '/en/shop', destination: '/tienda', permanent: true },
      { source: '/en/product/:slug/', destination: '/tienda', permanent: true },
      { source: '/en/product/:slug', destination: '/tienda', permanent: true },
      { source: '/en/:path*', destination: '/', permanent: true },

      // Old /es/ prefix
      { source: '/es/home/', destination: '/', permanent: true },
      { source: '/es/:path*', destination: '/', permanent: true },

      // www → non-www is handled by Vercel, but just in case
      // Old WordPress archive/feed URLs
      { source: '/recetas/:slug/feed/', destination: '/recetas', permanent: true },
      { source: '/recetas/:year/:month/', destination: '/recetas', permanent: true },
    ]
  },
}

module.exports = nextConfig
