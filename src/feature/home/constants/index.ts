interface NavItem {
  label: string
  icon: string
  to: string
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    icon: 'home',
    to: '/',
  },
  {
    label: 'About',
    icon: 'about',
    to: '/about',
  },
  {
    label: 'Contact',
    icon: 'contact',
    to: '/contact',
  },
]
