
import MobilePart from "./MobilePart";
import DesktopPart from "./DesktopPart";

export default function Header() {
  const navItems: Record<string, string>[] = [
    { href: "/", label: "Trang chủ" },
    { href: "/category", label: "Danh mục" }
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <MobilePart navItems={navItems} />
      <div className="hidden md:flex h-16 items-center justify-between px-6 w-full mx-auto">
        <DesktopPart navItems={navItems} />
      </div>
    </header>
  );
}
