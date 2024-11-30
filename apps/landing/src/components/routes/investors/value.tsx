import { FC } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ValuePropProps {
  className?: string;
}

const valueConfig = {
  easy: {
    heading: "Fast, straightforward, and inexpensive",
    subheading: "Invest seamlessly through our world-class platform with help at every step.",
    points: [
      "Invest from A-Z in as little as three minutes.",
      "All legal due diligence is handled by us in the background.",
      "Investments bare little to no fixed fees - disclosed simply and transparently.",
      "All business relationships are handled by us, taking all stress and responsibility away from you.", 
      "Invest in a managed Portfolio™ for completely headache free returns."
    ]
  },
  tooling: {
    heading: "Technology to understand and analyze investments",
    subheading: "Utilize proprietary technology to have clarity during decision making.",
    points: [
      "Harness the power of AI and statistical analysis to evaluate investments.",
      "Deeply understand your decisions and options in a simple manner - no expertise required.",
      "Access enterprise level analytics."
    ]
  },
  profitable: {
    heading: "Generate real returns - not losses",
    subheading: "Fully gauge risk to your tolerance.",
    points: [
      "Full risk disclosure for realistic expectations.",
      "Forecastable returns that don't disappoint.",
      "Simple liquidation opportunities.",
      "Short, medium and long exit horizons that satisfy your requirements."
    ]
  },
  permissible: {
    heading: "Shariah compliance at the core", 
    subheading: "Zero tolerance policy for non-compliance",
    points: [
      "All models validated by Islamic finance boards.",
      "Continuous business monitoring to ensure halal returns.",
      "Not just a feature, but a real personal commitment by the team."
    ]
  }
};

const ValueProp: FC<ValuePropProps> = ({ className }) => {
  return (
    <section className={cn("container py-16 space-y-8", className)}>
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          Access private markets easily
        </h2>
        <p className="text-lg text-muted-foreground">
          Investing in markets is lucrative, but it is not accessible to most.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.entries(valueConfig).map(([key, value]) => (
          <div key={key} className="space-y-4 rounded-lg border p-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{value.heading}</h3>
              <p className="text-sm text-muted-foreground">{value.subheading}</p>
            </div>
            <ul className="space-y-2 text-sm">
              {value.points.map((point, index) => (
                <li key={index} className="text-muted-foreground">
                  • {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export { ValueProp };
