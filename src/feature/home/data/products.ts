export interface Product {
  id: string
  title: string
  price: string
  image?: string
  badges?: string[]
}

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', title: 'Zhamira - Curita Para El Corazón Vinyl', price: '$28.00', badges: ['VINYL', 'PRE-ORDER'] },
  { id: '2', title: 'BLK ODYSSY - MOOD CONTROL Vinyl', price: '$30.00', badges: ['VINYL', 'PRE-ORDER'] },
  { id: '3', title: 'DESTIN CONRAD - LOVE ON DIGITAL VINYL', price: '$40.00', badges: ['VINYL'] },
  { id: '4', title: 'DESTIN CONRAD - WHIMSY (Glittery Green Vinyl)', price: '$40.00', badges: ['VINYL'] },
  { id: '5', title: 'American Palm Vinyl', price: '$28.00', badges: ['VINYL', 'PRE-ORDER'] },
  { id: '6', title: 'Classic Sound - Road Trip Vinyl', price: '$35.00', badges: ['VINYL'] },
  { id: '7', title: 'Hand Drawn Dreams Vinyl', price: '$32.00', badges: ['VINYL'] },
  { id: '8', title: 'Fall In Love With Her Vinyl', price: '$28.00', badges: ['VINYL'] },
]
