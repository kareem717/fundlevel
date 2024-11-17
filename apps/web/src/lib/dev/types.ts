export type Category = {
  label: string;
  description: string;
  href: string;
};

export type Industry =
  | "Technology"
  | "Artificial Intelligence"
  | "Enterprise Software"
  | "Real Estate"
  | "Construction"
  | "Sustainability"
  | "Healthcare"
  | "Biotechnology"
  | "Transportation"
  | "Agriculture"
  | "Urban Planning"
  | "Property Management"
  | "Entertainment"
  | "Virtual Reality"
  | "Energy"
  | "Research"
  | "Finance"
  | "Cryptocurrency"
  | "Education"
  | "Food & Beverage"
  | "Logistics"
  | "Manufacturing"
  | "Retail"
  | "Travel & Tourism"
  | "IoT"
  | "Insurance"
  | "Legal"
  | "Media & Entertainment"
  | "Non-Profit"
  | "Others";

export type Venture = {
  title: string;
  slug: string;
  description: string;
  logoUrl: string;
  category: string;
  location: string;
  industries: Industry[];
};
