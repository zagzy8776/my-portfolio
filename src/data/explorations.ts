/**
 * Visual playground content.
 *
 * Same contract as the journal: records are typed here, the display strings are
 * derived, and the licence for every photograph travels with its record rather
 * than living in someone's memory.
 *
 * Covers are real photography from Wikimedia Commons, graded into the site
 * palette and exported as WebP with a JPEG sibling. `npm run photos` fetches and
 * processes them; see `public/playground/CREDITS.md`.
 */
import { fallbackImage, type ImageCredit } from './journal-types'

export interface ExplorationItem {
  id: number
  /** Stable filename stem inside `public/playground/`. */
  slug: string
  title: string
  /** Small line shown under the title in the lightbox. */
  caption: string
  /** WebP path; the matching `.jpg` is the `<picture>` fallback. */
  image: string
  imageWidth: number
  imageHeight: number
  imageCredit: ImageCredit
}

/** Square plates — the playground grid is deliberately 1:1. */
export const EXPLORATION_SIZE = 1200

const AUTHOR = 'see source'

/**
 * Rotation is derived from the index rather than hand-typed, so adding a plate
 * can never produce two neighbours leaning the same way.
 */
const ROTATIONS = ['rotate-[-3deg]', 'rotate-[4deg]', 'rotate-[-2deg]', 'rotate-[3deg]', 'rotate-[-4deg]', 'rotate-[2deg]']

export function rotationFor(index: number): string {
  return ROTATIONS[index % ROTATIONS.length]
}

const ITEMS: ExplorationItem[] = [
  {
    id: 1,
    slug: 'fluid-dynamics',
    title: 'Fluid Dynamics Study',
    caption: 'Long-exposure water, graded to the site palette.',
    image: '/playground/fluid-dynamics.webp',
    imageWidth: EXPLORATION_SIZE,
    imageHeight: EXPLORATION_SIZE,
    imageCredit: {
      file: 'File:Water Surface (33236365632).jpg',
      author: AUTHOR,
      licence: 'CC BY 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:Water_Surface_(33236365632).jpg',
    },
  },
  {
    id: 2,
    slug: 'light-trails',
    title: 'Colour Light Trails',
    caption: 'Many discrete events collapsed into one smooth read.',
    image: '/playground/light-trails.webp',
    imageWidth: EXPLORATION_SIZE,
    imageHeight: EXPLORATION_SIZE,
    imageCredit: {
      file: 'File:Traffic light trails in LA (Unsplash).jpg',
      author: 'Kyle Murfin',
      licence: 'CC0',
      source: 'https://commons.wikimedia.org/wiki/File:Traffic_light_trails_in_LA_(Unsplash).jpg',
    },
  },
  {
    id: 3,
    slug: 'geometry-shadow',
    title: 'Minimalist Geometry',
    caption: 'Light raking across an unadorned wall.',
    image: '/playground/geometry-shadow.webp',
    imageWidth: EXPLORATION_SIZE,
    imageHeight: EXPLORATION_SIZE,
    imageCredit: {
      file: 'File:Shadow on the wall - Flickr - liebeslakritze.jpg',
      author: AUTHOR,
      licence: 'CC BY-SA 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:Shadow_on_the_wall_-_Flickr_-_liebeslakritze.jpg',
    },
  },
  {
    id: 4,
    slug: 'flowing-streams',
    title: 'Dark Flowing Streams',
    caption: 'Rushing water, held still.',
    image: '/playground/flowing-streams.webp',
    imageWidth: EXPLORATION_SIZE,
    imageHeight: EXPLORATION_SIZE,
    imageCredit: {
      file: 'File:KRPI radio towers near Ferndale in sunset (34721481871).jpg',
      author: AUTHOR,
      licence: 'CC BY 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:KRPI_radio_towers_near_Ferndale_in_sunset_(34721481871).jpg',
    },
  },
  {
    id: 5,
    slug: 'glass-render',
    title: 'Futuristic Facade',
    caption: 'A gridded high-rise, read as material.',
    image: '/playground/glass-render.webp',
    imageWidth: EXPLORATION_SIZE,
    imageHeight: EXPLORATION_SIZE,
    imageCredit: {
      file: 'File:Münster, Westdeutsche Lotterie -- 2018 -- 0417.jpg',
      author: AUTHOR,
      licence: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:M%C3%BCnster,_Westdeutsche_Lotterie_--_2018_--_0417.jpg',
    },
  },
  {
    id: 6,
    slug: 'monochrome-pattern',
    title: 'Monochrome Pattern',
    caption: 'Structure repeated until it becomes texture.',
    image: '/playground/monochrome-pattern.webp',
    imageWidth: EXPLORATION_SIZE,
    imageHeight: EXPLORATION_SIZE,
    imageCredit: {
      file: 'File:Staircase, Cleveland Trust Company Building, Euclid Avenue and East 9th Street, Cleveland, OH - 52990423418.jpg',
      author: 'w_lemay',
      licence: 'CC BY-SA 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:Staircase,_Cleveland_Trust_Company_Building,_Euclid_Avenue_and_East_9th_Street,_Cleveland,_OH_-_52990423418.jpg',
    },
  },
]

export const EXPLORATION_ITEMS = ITEMS
export { fallbackImage }
