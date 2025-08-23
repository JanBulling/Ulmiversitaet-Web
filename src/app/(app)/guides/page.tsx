import { getAllGuides } from "@/content/guides/guides";

export default async function GuidesPage() {
  const allGuides = getAllGuides();

  return (
    <div className="">
      {allGuides.map((g) => (
        <div key={g.slug}>
          {g.slug} {JSON.stringify(g.metadata)}
        </div>
      ))}
    </div>
  );
}
