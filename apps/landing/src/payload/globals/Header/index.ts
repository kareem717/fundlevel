import type { GlobalConfig } from "payload";

import { link } from "../../fields/link";
import { revalidateHeader } from "./hooks/revalidateHeader";
import { HEADER_SLUG } from "../constants";

export const Header: GlobalConfig = {
  slug: HEADER_SLUG,
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "siteHeader",
          label: "Site Header",
          fields: [
            {
              name: "logo",
              type: "relationship",
              relationTo: "media",
            },
          ],
        },
        {
          name: "shopHeader",
          label: "Shop Header",
          fields: [
            {
              name: "navItems",
              type: "array",
              fields: [
                link({
                  appearances: false,
                }),
              ],
              maxRows: 6,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
};
