// app/dashboard/layout.tsx
import SideNav from '../../components/ui/sidenav/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <div className="layout__sidenav">
        <SideNav />
      </div>
      <div className="layout__content">{children}</div>
    </div>
  );
}
