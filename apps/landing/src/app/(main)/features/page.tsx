import { meta } from "@/lib/config";

export const metadata = meta.features;

export default function FeaturesPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-4xl font-bold mb-8">Features</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Fast & Reliable</h2>
          <p className="text-muted-foreground">
            Built with performance in mind, ensuring quick load times and smooth interactions.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Secure</h2>
          <p className="text-muted-foreground">
            Enterprise-grade security measures to protect your data and privacy.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">User-Friendly</h2>
          <p className="text-muted-foreground">
            Intuitive interface designed for the best possible user experience.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">24/7 Support</h2>
          <p className="text-muted-foreground">
            Round-the-clock customer support to help you with any questions.
          </p>
        </div>
      </div>
    </div>
  );
}
