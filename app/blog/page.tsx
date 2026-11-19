import { redirect } from 'next/navigation';
import { siteConfig } from '../../site.config';

export const dynamic = 'force-static';

export const metadata = {
  title: `Блог | ${siteConfig.title}`,
  description: 'Мысли о технологиях и жизни',
};

export default function BlogPage() {
  redirect('/blog/page/1');
}
