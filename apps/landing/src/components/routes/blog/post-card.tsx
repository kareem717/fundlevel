"use client";

import { ComponentPropsWithoutRef, FC, Fragment } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useClickableCard } from "@/lib/hooks/use-clickable-card";
import type { Post } from "@/payload-types";
import { Media } from "@/components/payload/Media";

export interface PostCardProps extends ComponentPropsWithoutRef<"article"> {
  alignItems?: "center";
  className?: string;
  doc?: Post;
  showCategories?: boolean;
  title?: string;
}

export const PostCard: FC<PostCardProps> = ({
  alignItems,
  className,
  doc,
  showCategories,
  title: titleFromProps,
  ...props
}) => {
  const { card, link } = useClickableCard({});

  const { slug, categories, meta, title } = doc || {};
  const { description, image: metaImage } = meta || {};

  const hasCategories =
    categories && Array.isArray(categories) && categories.length > 0;
  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, " "); // replace non-breaking space with white space
  const href = `/blog/${slug}`;

  return (
    <article
      className={cn(
        "border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer",
        className
      )}
      ref={card.ref}
      {...props}
    >
      <div className="relative w-full ">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== "string" && (
          <Media resource={metaImage} size="360px" />
        )}
      </div>
      <div className="p-4">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-4">
            {showCategories && hasCategories && (
              <div>
                {categories?.map((category, index) => {
                  if (typeof category === "object") {
                    const { title: titleFromCategory } = category;

                    const categoryTitle =
                      titleFromCategory || "Untitled category";

                    const isLast = index === categories.length - 1;

                    return (
                      <Fragment key={index}>
                        {categoryTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && (
          <div className="mt-2">
            {description && <p>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </article>
  );
};
