import { FC } from "react";
import { cn } from "@/lib/utils";

interface ModelsSectionProps {
  className?: string;
}

const modelsConfig = {
  revenue: {
    title: "Revenue/Profit Sharing",
    description: "Purchase and own a part of a businesses profits or revenue. Work in a real partnership that creates the optimal aspects of being a equity owner."
  },
  equity: {
    title: "Equity Financing", 
    description: "Purchase real ownership in a business. Become a large stakeholder through low investor count ventures, or invest with extremely low minimums via crowdfunding rounds."
  },
  asset: {
    title: "Asset funding",
    description: "Supply funding for assets that enable businesses to generate profits and benefit for providing working capital that truly works. You're not just investing in a business - your really partnering with it."
  }
};

const ModelsSection: FC<ModelsSectionProps> = ({ className }) => {
  return (
    <section className={cn("container py-16 space-y-12", className)}>
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          Models For Investors
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(modelsConfig).map(([key, model]) => (
          <div 
            key={key}
            className="group relative overflow-hidden rounded-xl border p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-accent/5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative space-y-4">
              <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                {model.title}
              </h3>
              
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {model.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { ModelsSection };
