export type SocialKind = 'email' | 'github' | 'linkedin' | 'external';

export type SocialLink = {
  label: string;
  href: string;
  kind: SocialKind;
  username?: string;
};

export type Socials = {
  email: string;
  links: SocialLink[];
};

export const socials: Socials = {
  email: 'daokhoinguyen.go@gmail.com',
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/nguyendao16',
      kind: 'github',
      username: 'nguyendao16',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/nguyendao16/',
      kind: 'linkedin',
      username: 'nguyendao16',
    },
  ],
};

export const emailLink = `mailto:${socials.email}`;
