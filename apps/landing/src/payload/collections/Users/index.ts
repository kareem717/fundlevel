import type { CollectionConfig } from "payload";
import { anyone, admins, authenticated } from "@/payload/access";
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin";
import { USER_SLUG } from "../constants";

const Users: CollectionConfig = {
  slug: USER_SLUG,
  access: {
    admin: admins,
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["name", "email", "roles"],
    useAsTitle: "name",
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "roles",
      type: "select",
      access: {
        /* create: admins, */
        read: admins,
        update: admins,
      },
      defaultValue: ["admin"],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: "admin",
          value: "admin",
        },
      ],
    },
  ],
  timestamps: true,
} as const;

export default Users;
