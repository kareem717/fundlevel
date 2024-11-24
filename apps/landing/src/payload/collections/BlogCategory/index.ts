import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../../access";
import { slugField } from "../../fields/slug";
import { BLOG_CATEGORY_SLUG } from "../constants";

const BlogCategory: CollectionConfig = {
  slug: BLOG_CATEGORY_SLUG,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: "Blog",
    useAsTitle: "title",
  },
  fields: [
    ...slugField(),
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "showInFilter",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
} as const;

export default BlogCategory;
