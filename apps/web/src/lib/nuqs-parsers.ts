import { createParser } from 'nuqs'

// Minifies the string
const parseAsShortenedString = createParser({
  parse(queryValue: string) {
    // Parse the query value to a string
    return queryValue || ""
  },
  serialize(value: string) {
    // Create a string of stars based on the length of the value
    return Array.from({ length: value.length }, () => '★').join('')
  }
})