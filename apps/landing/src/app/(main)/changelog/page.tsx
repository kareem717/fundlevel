import { meta } from "@/lib/config";

export const metadata = meta.changelog;

export default function ChangelogPage() {
  return (
    <div className="container max-w-4xl py-8 mt-16 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Changelog</h1>

      <div className="space-y-12">
        <div className="border-l-2 pl-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">Version 1.0.0</h2>
            <span className="text-sm text-muted-foreground">2024-01-20</span>
          </div>
          <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
            <li>Initial release</li>
            <li>Core functionality implemented</li>
            <li>Basic UI components added</li>
          </ul>
        </div>

        <div className="border-l-2 pl-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">Beta Release</h2>
            <span className="text-sm text-muted-foreground">2023-12-15</span>
          </div>
          <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
            <li>Beta testing phase initiated</li>
            <li>Performance improvements</li>
            <li>Bug fixes and stability enhancements</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
