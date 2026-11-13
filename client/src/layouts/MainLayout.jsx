import { useEffect } from 'react';
import { ScrollDirector } from '../animations/ScrollDirector';
import { AmbientBowl } from '../components/scrolling/AmbientBowl';
import { FloatingNavbar } from '../components/scrolling/FloatingNavbar';
import { ScrollProgressIndicator } from '../components/scrolling/ScrollProgressIndicator';
import { SiteFooter } from '../components/footer/SiteFooter';

export function MainLayout({ children, showBowlGlow = true }) {
  useEffect(() => {
    const unsubscribe = ScrollDirector.subscribe(() => {});
    return unsubscribe;
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-fcit-cream text-fcit-ink">
      <ScrollProgressIndicator />
      {showBowlGlow && <AmbientBowl />}
      <FloatingNavbar />
      <main id="main-content" className="relative z-10 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
