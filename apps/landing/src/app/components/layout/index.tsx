// This is a design system for building responsive layouts in React
import React from 'react'
import { cn } from '@repo/ui/lib/utils'

type MainProps = {
  children: React.ReactNode
  className?: string
  id?: string
}

type SectionProps = {
  children: React.ReactNode
  className?: string
  id?: string
}

type ContainerProps = {
  children: React.ReactNode
  className?: string
  id?: string
}

type ArticleProps = {
  children?: React.ReactNode
  className?: string
  id?: string
  dangerouslySetInnerHTML?: { __html: string }
}

type BoxProps = {
  children: React.ReactNode
  className?: string
  direction?:
  | 'row'
  | 'col'
  | {
    sm?: 'row' | 'col'
    md?: 'row' | 'col'
    lg?: 'row' | 'col'
    xl?: 'row' | 'col'
    '2xl'?: 'row' | 'col'
  }
  wrap?:
  | boolean
  | {
    sm?: boolean
    md?: boolean
    lg?: boolean
    xl?: boolean
    '2xl'?: boolean
  }
  gap?:
  | number
  | { sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number }
  cols?:
  | number
  | { sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number }
  rows?:
  | number
  | { sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number }
}

// Main Component
// This component is used for the main content area of the page

const Main = ({ children, className, id }: MainProps) => {
  return (
    <main
      className={cn(
        // `Main` Specific Styles
        'max-w-none prose-p:m-0',
        // General Prose
        'prose prose-neutral prose:font-sans dark:prose-invert xl:prose-lg',
        // Prose Headings
        'prose-headings:font-normal',
        // Prose Strong
        'prose-strong:font-semibold',
        // Inline Links
        'prose-a:underline prose-a:decoration-primary/50 prose-a:underline-offset-2 prose-a:text-foreground/75 prose-a:transition-all',
        // Inline Link Hover
        'hover:prose-a:decoration-primary hover:prose-a:text-foreground',
        // Blockquotes
        'prose-blockquote:not-italic',
        // Pre and Code Blocks
        'prose-pre:border prose-pre:bg-muted/25 prose-pre:text-foreground',
        className
      )}
      id={id}
    >
      {children}
    </main>
  )
}

// Section Component
// This component is used for defining sections within the page and vertical spacing
const Section = ({ children, className, id }: SectionProps) => {
  return (
    <section className={cn('py-8 md:py-12', 'w-full', className)} id={id}>
      {children}
    </section>
  )
}

// Container Component
// This component is used for containing content with a maximum width and padding

const Container = ({ children, className, id }: ContainerProps) => {
  return (
    <div
      className={cn('mx-auto max-w-7xl space-y-12', 'p-6 sm:p-8', className)}
      id={id}
    >
      {children}
    </div>
  )
}

// Article Component
// This component is used for rendering articles with optional dangerouslySetInnerHTML

const Article = ({
  children,
  className,
  id,
  dangerouslySetInnerHTML,
}: ArticleProps) => {
  return (
    <article
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      className={cn(
        // General Prose
        'prose prose-neutral prose:font-sans dark:prose-invert xl:prose-lg',
        // Prose Headings
        'prose-headings:font-normal',
        // Prose Paragraphs
        'prose-p:mb-0',
        // Prose Strong
        'prose-strong:font-semibold',
        // Inline Links
        'prose-a:underline prose-a:decoration-primary/50 prose-a:underline-offset-2 prose-a:text-foreground/75 prose-a:transition-all',
        // Inline Link Hover
        'hover:prose-a:decoration-primary hover:prose-a:text-foreground',
        // Blockquotes
        'prose-blockquote:not-italic',
        // Pre and Code Blocks
        'prose-pre:border prose-pre:bg-muted/25',
        className
      )}
      id={id}
    >
      {children}
    </article>
  )
}

const Box = ({
  children,
  className,
  direction = 'row',
  wrap = false,
  gap = 0,
  cols,
  rows,
}: BoxProps) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  }

  const wrapClasses = wrap ? 'flex-wrap' : 'flex-nowrap'

  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  }

  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  }

  const rowsClasses = {
    1: 'grid-rows-1',
    2: 'grid-rows-2',
    3: 'grid-rows-3',
    4: 'grid-rows-4',
    5: 'grid-rows-5',
    6: 'grid-rows-6',
    7: 'grid-rows-7',
    8: 'grid-rows-8',
    9: 'grid-rows-9',
    10: 'grid-rows-10',
    11: 'grid-rows-11',
    12: 'grid-rows-12',
  }

  const getResponsiveClasses = (
    prop: any,
    classMap: Record<string | number, string>
  ) => {
    if (typeof prop === 'object') {
      return Object.entries(prop)
        .map(([breakpoint, value]) => {
          const prefix = breakpoint === 'sm' ? '' : `${breakpoint}:`
          return `${prefix}${classMap[value as keyof typeof classMap] || ''}`
        })
        .join(' ')
    }
    return classMap[prop as keyof typeof classMap] || ''
  }

  const stackClasses = cn(
    cols || rows ? 'grid' : 'flex',
    getResponsiveClasses(direction, directionClasses),
    typeof wrap === 'boolean'
      ? wrapClasses
      : getResponsiveClasses(wrap, { true: 'flex-wrap', false: 'flex-nowrap' }),
    getResponsiveClasses(gap, gapClasses),
    cols && getResponsiveClasses(cols, colsClasses),
    rows && getResponsiveClasses(rows, rowsClasses), // Assuming rows use the same classes as cols
    className
  )

  return <div className={stackClasses}>{children}</div>
}

// Exporting all components for use in other parts of the application

export { Main, Section, Container, Article, Box }

// Instructions for AI
// How to use craft-ds:
// 1. Import the components you need in your React components:
//    import { Main, Section, Container, Article, Box } from "@/components/craft";

// 2. Use the components to build your layout:
//    export default function Page() {
//      return (
//        <Main>
//          <Section>
//            <Container>
//              <h1>Heading</h1>
//              <p>Content</p>
//            </Container>
//          </Section>
//        </Main>
//      );
//    }

// 3. Customize the components using the className prop:
//    <Container className="custom-container">
//      {/* Your content here */}
//    </Container>

// 4. Use the Box component for flexible layouts:
//    <Box direction="row" wrap={true} gap={4}>
//      <div>Item 1</div>
//      <div>Item 2</div>
//    </Box>

//    <Box cols={3} gap={4}>
//      <div>Item 1</div>
//      <div>Item 2</div>
//      <div>Item 3</div>
//    </Box>

// Component Usage Examples:

// Main
// <Main className="custom-class" id="main-content">
//   {/* main content here */}
// </Main>

// Section
// <Section className="custom-section" id="unique-section">
//   {/* section content here */}
// </Section>

// Container
// <Container className="custom-container" id="container-id">
//   {/* contained content here */}
// </Container>

// Article
// <Article className="custom-article" id="article-id">
//   {/* article content here */}
// </Article>

// Box (Flex mode)
// <Box
//   direction={{ sm: "col", md: "row" }}
//   wrap={true}
//   gap={{ sm: 2, md: 4 }}
//   className="items-center justify-between"
// >
//   <div>Item 1</div>
//   <div>Item 2</div>
// </Box>

// Box (Grid mode)
// <Box
//   cols={{ sm: 1, md: 2, lg: 3 }}
//   gap={{ sm: 2, md: 4 }}
//   className="items-start justify-items-center"
// >
//   <div>Item 1</div>
//   <div>Item 2</div>
//   <div>Item 3</div>
// </Box>

// Additional notes for AI:
// 1. The Box component is versatile and can be used for both flex and grid layouts.
// 2. Use the 'direction' prop for flex layouts and 'cols' or 'rows' props for grid layouts.
// 3. All components support responsive design through Tailwind classes.
// 4. The cn() function is used to merge Tailwind classes efficiently.
// 5. Remember to use appropriate semantic HTML structure with these components.
// 6. These components are designed to work with Tailwind CSS, ensure it's properly set up in the project.
// 7. For typography styles, refer to the Main and Article components which use Tailwind's typography plugin.
