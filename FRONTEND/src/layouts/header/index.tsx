
import MobilePart from "./MobilePart";
import DesktopPart from "./DesktopPart";
import SeasonalHeaderBackground from "./SeasonalHeaderBackground";

export default function Header() {
  const navItems: Record<string, string>[] = [
    { href: "/", label: "Trang chủ" },
    { href: "/category", label: "Danh mục" }
  ];
  return (
    <header className="sticky top-0 z-50 w-full h-16 shrink-0 border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-[1440px] relative z-20 h-full">
        <div className="flex h-full items-center justify-between">
          <MobilePart navItems={navItems} />
          <div className="hidden md:flex h-full items-center justify-between w-full mx-auto">
            <DesktopPart navItems={navItems} />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <SeasonalHeaderBackground />
      </div>
    </header>
  );
}
