export type NavigationItem = {
  href: string;
  label: string;
};

export const navigation: NavigationItem[] = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
