import { QuickLinksSection } from "@/components/home/quick-links-section";
import SearchBar from "@/components/home/search-bar";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-4 md:space-y-8">
      <SearchBar />

      <QuickLinksSection />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
        {/* Mensa Menu */}
        <div className="md:col-span-2">
          <div className="bg-card h-64 border shadow md:rounded-md"></div>
        </div>

        {/* Public transport */}
        <div className="md:col-span-1">
          <div className="bg-card h-64 border shadow md:rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
