"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { PayloadAdminBar } from "payload-admin-bar";
import type { PayloadAdminBarProps } from "payload-admin-bar";
import { useSelectedLayoutSegments } from "next/navigation";

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
}

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {};
  const segments = useSelectedLayoutSegments();
  const [show, setShow] = useState(false);
  const collectionKey = segments?.[1] as keyof typeof collectionLabels || "pages";
  const collection = collectionLabels[collectionKey];

  const onAuthChange = React.useCallback((user: any) => {
    setShow(user?.id);
  }, []);

  return (
    <div
      className={cn('py-2 bg-black text-white', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={process.env.NEXT_PUBLIC_SERVER_URL}
          collection={collectionKey}
          collectionLabels={{
            plural: collectionLabels[collectionKey]?.plural || 'Pages',
            singular: collectionLabels[collectionKey]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}
