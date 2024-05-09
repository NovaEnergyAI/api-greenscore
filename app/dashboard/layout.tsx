import SideNav from './ui/sidenav/sidenav';

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
