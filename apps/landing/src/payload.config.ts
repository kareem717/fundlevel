import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { env } from "./env";
import collections from "./payload/collections";
import globals from "./payload/globals";
import Users from "./payload/collections/Users";
import { revalidateRedirects } from "./payload/hooks/revalidateRedirects";
import { generateTitle, generateURL } from "./lib/utils/seo";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections,
  globals,
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  plugins: [
    redirectsPlugin({
      collections: ["pages", "posts"],
      overrides: {
        admin: {
          group: "Forms",
        },
        // @ts-expect-error
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ("name" in field && field.name === "from") {
              return {
                ...field,
                admin: {
                  description:
                    "You will need to rebuild the website when changing this field.",
                },
              };
            }
            return field;
          });
        },
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    s3Storage({
      collections: {
        ["media"]: true,
      },
      bucket: process.env.S3_BUCKET || "media",
      config: {
        endpoint: process.env.S3_ENDPOINT || "",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        region: process.env.S3_REGION || "",
      },
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
