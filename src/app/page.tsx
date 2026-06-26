import { Sidebar } from '@/components/Sidebar';
import { MainPanel } from '@/components/MainPanel';
import { MobileMenuButton } from '@/components/MobileMenuButton';

export default function Home() {
  return (
    <div className="flex h-screen bg-ink-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <MobileMenuButton />
        <MainPanel />
      </main>
    </div>
  );
}
