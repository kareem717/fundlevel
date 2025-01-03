import type { Page } from '@payload-types'

export type ArchiveBlockProps = Extract<
  NonNullable<Page['layout']>[0], 
  { blockType: 'archive' }
>
