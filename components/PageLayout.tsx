// PageLayout.tsx
import NavigationWrapper from './NavigationWrapper';
import Footer from './Footer';
import SuspenseWrapper from './SuspenseWrapper';
import BackToTop from './BackToTop';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
    <NavigationWrapper />
    <main className="flex-1 pt-16">
    <SuspenseWrapper loadingText="Загрузка страницы...">
    {children}
    </SuspenseWrapper>
    </main>
    <Footer />
    <BackToTop />
    </div>
  );
}
