export interface Project {
  name: string;
  description: string;
  link: {
    href: string;
    label: string;
  };
}

export const projects: Project[] = [
  {
    name: "ClearProxy",
    description:
      "A modern, intuitive web UI for managing Caddy reverse proxies. Features automatic HTTPS, real-time configuration, basic auth support, and a clean SvelteKit + Tailwind interface.",
    link: {
      href: "https://github.com/foggymtndrifter/ClearProxy",
      label: "github.com",
    },
  },
  {
    name: "rockylinux.org",
    description:
      "The official website of the Rocky Linux project, built with Next.js, Tailwind CSS, and shadcn/ui. Serves as the initial point of contact for users, and is the source of truth for information.",
    link: {
      href: "https://github.com/rocky-linux/rockylinux.org",
      label: "github.com",
    },
  },
  {
    name: "asknot-rocky",
    description:
      "This interactive guide helps newcomers find their place in the Rocky Linux community by asking a series of questions about their interests and skills.",
    link: {
      href: "https://github.com/rocky-linux/asknot-rocky",
      label: "github.com",
    },
  },
];
