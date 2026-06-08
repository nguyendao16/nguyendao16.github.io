export type NavigationItem = {
  href: string;
  label: string;
};

export const navigation: NavigationItem[] = [
  { href: '/', label: 'Trang chủ' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'Về tôi' },
  { href: '/contact', label: 'Liên hệ' },
];
