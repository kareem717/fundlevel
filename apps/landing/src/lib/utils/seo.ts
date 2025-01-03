import {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
} from "@payloadcms/plugin-seo/types";

export const generateTitle: GenerateTitle = (data) => {
  const title =
    typeof data?.doc?.title?.value === "string"
      ? data?.doc?.title?.value
      : typeof data?.title === "string"
        ? data.title
        : "";

  return title;
};

export const generateTitlePrompt: GenerateTitle = (data) => {
  const title =
    typeof data?.doc?.title?.value === "string"
      ? data?.doc?.title?.value
      : typeof data?.title === "string"
        ? data.title
        : "";

  return `Generate a SEO title for a blog post for ${title} in 50-60 chars`;
};

export const generateDescription: GenerateDescription = (data) => {
  const description =
    typeof data?.doc?.description?.value === "string"
      ? data?.doc?.description?.value
      : "";

  return description;
};

export const generateDescriptionPrompt: GenerateDescription = (data) => {
  const description =
    typeof data?.doc?.description?.value === "string"
      ? data?.doc?.description?.value
      : "";

  return `Generate a summarized description for a blog post with description ${description} in 100-150 chars`;
};

export const generateImage: GenerateImage = (data) => {
  const image =
    typeof data?.doc?.doctor_image?.value === "string"
      ? data?.doc?.doctor_image?.value
      : "";

  return image;
};

export const generateURL: GenerateURL = (data) => {
  const url = `${process.env.PAYLOAD_URL}/${data?.locale ? data?.locale + "/" : ""}${data?.collectionSlug || data?.collectionConfig?.slug || ""}/${data?.initialData?.slug || ""}`;

  return url || "";
};
