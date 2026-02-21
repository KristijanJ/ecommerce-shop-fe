# ecommerce-shop-fe

Next.js frontend for the ecommerce shop.

## Stack

- **Next.js 16** — App Router, Server Actions, Server Components
- **React 19** — UI
- **Tailwind CSS 4** — styling
- **jose** — JWT session handling (server-side)
- **TypeScript**

## Features

- Product browsing with category and search filters
- Product detail pages
- Shopping cart (client-side context)
- Checkout and payment flow
- Order confirmation and purchase history
- Seller dashboard — list, create, edit, delete own products
- Auth — register, login, cookie-based JWT session

## Development

Copy the example env and fill in the values:

```bash
cp .env.example .env.local
```

```bash
npm run dev     # start dev server at http://localhost:3000
npm run build   # production build
npm start       # run production build
npm run lint    # lint
```

> Requires the backend to be running. See `ecommerce-shop-be`.
