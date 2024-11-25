import React from "react";
import type { BlogCategory, Post } from "@/payload-types";
import RichText from "@/components/payload/RichText";
import type { ArchiveBlockProps } from "./types";
import { CollectionArchive } from "@/components/payload/CollectionArchive";
import getPayload from "@/lib/utils/getPayload";

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string;
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
  } = props;

  const limit = limitFromProps || 3;

  let posts: Post[] = [];

  if (populateBy === "collection") {
    const payload = await getPayload();

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === "object" && category !== null) {
        return category.id;
      }
      return category;
    });

    const fetchedPosts = await payload.find({
      collection: "posts",
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    });

    posts = fetchedPosts.docs;
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((doc) => {
        if (doc.relationTo === "posts" && typeof doc.value === "object") {
          return doc.value as Post;
        }
      }).filter(Boolean) as Post[];

      posts = filteredSelectedPosts;
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText
            className="ml-0 max-w-[48rem]"
            content={introContent}
            enableGutter={false}
          />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  );
};
