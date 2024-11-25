import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import collections from "./payload/collections";
import globals from "./payload/globals";
import Users from "./payload/collections/Users";
import { revalidateRedirects } from "./payload/hooks/revalidateRedirects";
import { generateTitle, generateURL } from "./lib/utils/seo";
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { env } from './env'

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
      bucket: env.AWS_BUCKET_NAME,
      config: {
        endpoint: env.AWS_URI,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
        region: env.AWS_REGION,
      },
    }),
  ],
  email: nodemailerAdapter({
    defaultFromAddress: 'payloadcms@fundlevel.app',
    defaultFromName: 'Fundlevel Payload CMS',
    transportOptions: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    },
  }),
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
