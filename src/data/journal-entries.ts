import { getReadTime, type JournalEntry } from './journal-types'

const AUTHOR = 'Ekenedirichukwu Isdore Amadi'
const AUTHOR_ROLE = 'Founder · Full-stack Engineer, Vura Tech Hub'

/** Authored shape — `readTime` is derived below rather than typed in. */
type EntrySource = Omit<JournalEntry, 'readTime'>

/** Cover art lives in `public/journal/` — never hotlinked from a third party. */
const ENTRIES: EntrySource[] = [
  {
    slug: 'micro-interactions',
    title: 'The Subtle Art of Micro-interactions in Modern Web Design',
    displayTitle: 'The Subtle Art of Micro-interactions',
    date: '2026-08-12',
    reviewed: '2026-09-30',
    image: '/journal/micro-interactions.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: 'Water Surface (33236365632).jpg',
      author: 'Wikimedia Commons contributor',
      licence: 'CC BY 2.0',
      source: "https://commons.wikimedia.org/wiki/File:Water_Surface_(33236365632).jpg",
    },
    tags: ['Design', 'UX'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'Micro-interactions are the smallest unit of product craft. Here is how I decide which ones earn their place — and which are just decoration.',
    status: 'published',
    content: [
      {
        type: 'p',
        text: 'In the landscape of modern digital design, the difference between a good product and a truly remarkable one often lies in the details. These details are what we call micro-interactions — subtle, functional animations that guide users, provide feedback, and breathe life into interfaces.',
      },
      {
        type: 'p',
        text: 'A micro-interaction is a single-task cycle that does one thing: it triggers when a user hovers over a button, toggles a switch, pulls to refresh, or watches a page transition load. Its purpose is not just to look pretty, but to explain what is happening under the hood. It connects human action with system reaction.',
      },
      { type: 'h2', text: 'The three rules I hold myself to' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Keep them brief — under 300ms for anything triggered by direct input.',
          'Make them feel natural — physics-based easings, never linear on a spatial change.',
          'Give them a job — if it cannot be explained in one sentence, it is decoration.',
        ],
      },
      {
        type: 'p',
        text: 'Think of the pulsing green indicator in your status bar or the reversing gradient ring on a logo — these are micro-interactions. They communicate state changes without cluttering the screen with text. They reassure the user that their actions have been received.',
      },
      {
        type: 'quote',
        text: 'Over-animating fatigues the user. Subtle nuances make a digital space feel human.',
        attribution: 'A note pinned above my desk',
      },
      {
        type: 'p',
        text: 'In practice this means a motion token set, not one-off easings sprinkled through a codebase. Everything I ship starts from the same handful of curves, so a hover in the navigation and a modal entrance feel like they came from the same hand.',
      },
      {
        type: 'code',
        language: 'css',
        filename: 'src/index.css',
        code: `@keyframes role-fade-in {
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-role-fade-in {
  animation: role-fade-in 0.4s ease-out;
}`,
      },
      {
        type: 'p',
        text: 'Anything longer than a quarter second stops reading as responsiveness and starts reading as latency. Under direct manipulation the interface must feel like it is already obeying you.',
      },
      {
        type: 'image',
        src: '/journal/micro-interactions-ring.webp',
        alt: 'Concentric rings spreading from a single drop landing on still water',
        caption: "One drop, one ring, one property — the physical version of a 300ms hover state.",
        width: 1600,
        height: 1067,
      },
      {
        type: 'p',
        text: 'The uncomfortable test: disable the animation and see whether anything is lost. If a state change is still perfectly understandable without it, the motion was never carrying meaning — it was carrying texture. Ship it only when you want texture on purpose.',
      },
    ],
  },
  {
    slug: 'minimalist-architecture',
    title: 'Why Minimalist Architecture Inspires Clean User Interfaces',
    displayTitle: 'Why Minimalist Architecture Inspires Clean UI',
    date: '2026-07-28',
    reviewed: '2026-09-12',
    image: '/journal/minimalist-architecture.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: 'Shadow on the wall - Flickr - liebeslakritze.jpg',
      author: 'liebeslakritze',
      licence: 'CC BY-SA 2.0',
      source:
        'https://commons.wikimedia.org/wiki/File:Shadow_on_the_wall_-_Flickr_-_liebeslakritze.jpg',
    },
    tags: ['Design', 'Systems'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'Structural minimalism is a transferable discipline: load-bearing lines exposed, emptiness treated as an active material, ornament removed until only intent remains.',
    status: 'published',
    content: [
      {
        type: 'p',
        text: 'Walk into a modernist concrete building, and you will notice how structural load-bearing lines are exposed, how glass frames the landscape, and how empty space is treated as an active element. Minimalist architecture strips away ornament to reveal the pure essence of form.',
      },
      {
        type: 'p',
        text: 'This physical philosophy translates directly into digital interface design. In UI/UX we refer to this as negative space, structure, and hierarchy. Just as an architect uses physical columns to guide visitors through a building, a software engineer uses typography weights and grids to guide eyes through information.',
      },
      { type: 'h2', text: 'Emptiness is a load-bearing element' },
      {
        type: 'p',
        text: 'The common mistake is treating whitespace as leftover space — the gap that remains once the real content has been placed. Architects do the opposite. The atrium is designed first; the rooms are fitted around it. In an interface, generous space around a single headline is not wasted room, it is the mechanism that makes the headline important.',
      },
      {
        type: 'quote',
        text: 'Silence is the ultimate premium feature in a world full of digital noise.',
        attribution: 'Vura Tech Hub design principles',
      },
      {
        type: 'p',
        text: 'By stripping away unnecessary borders, drop shadows, and high-frequency patterns, we allow the content itself to shine. The interface becomes transparent. The user does not focus on the browser window; they focus on the data, the product, or the narrative.',
      },
      {
        type: 'list',
        items: [
          'One hairline border instead of a shadow stack.',
          'One accent colour, used for a single semantic job.',
          'A type scale doing the work that boxes used to do.',
          'Motion reserved for state changes, not for entrance theatre.',
        ],
      },
      {
        type: 'p',
        text: 'At Vura Tech Hub we study structural minimalism directly against the systems we ship. We replace noisy components with quiet layouts, letting typography do the heavy lifting. It is slower to design and far cheaper to maintain — a component with fewer decisions in it is a component with fewer ways to go wrong.',
      },
    ],
  },
  {
    slug: 'design-systems',
    title: 'Structuring Design Systems for Long-term Scalability',
    displayTitle: 'Structuring Design Systems for Scalability',
    date: '2026-06-15',
    reviewed: '2026-08-20',
    image: '/journal/design-systems.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: 'Münster, Westdeutsche Lotterie -- 2018 -- 0417.jpg',
      author: 'Dietmar Rabich',
      licence: 'CC BY-SA 4.0',
      source:
        'https://commons.wikimedia.org/wiki/File:M%C3%BCnster,_Westdeutsche_Lotterie_--_2018_--_0417.jpg',
    },
    tags: ['Engineering', 'Design Systems'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'A design system is a repository, not a Figma file. Tokens are the atomic layer that keeps ten platforms consistent for years instead of weeks.',
    status: 'published',
    content: [
      {
        type: 'p',
        text: 'A design system is not a static Figma document or a set of CSS utility classes. It is an evolving software repository, a single source of truth that bridges design intent with final code execution.',
      },
      {
        type: 'p',
        text: 'When scaling products — like Vura Bank, VEEDA, and Realssa — consistency becomes a significant challenge. Without a systematic approach, codebase drift occurs: different developers build different button components, colours shift, and margins diverge. The solution is a design token architecture.',
      },
      { type: 'h2', text: 'Tokens are the atomic layer' },
      {
        type: 'p',
        text: 'Design tokens are the atomic values of a system: colours, font weights, spacing multipliers, radii, and easing curves. Store them once in a centralised file and compile them outwards to CSS custom properties, a Tailwind theme, or Swift and Kotlin definitions.',
      },
      {
        type: 'code',
        language: 'css',
        filename: 'src/index.css',
        code: `:root,
.dark {
  --bg: 0 0% 4%;
  --surface: 0 0% 8%;
  --text: 0 0% 96%;
  --muted: 0 0% 53%;
  --stroke: 0 0% 12%;
}

.light {
  --bg: 0 0% 98%;
  --surface: 0 0% 100%;
  --text: 0 0% 8%;
  --muted: 0 0% 40%;
  --stroke: 0 0% 90%;
}`,
      },
      {
        type: 'p',
        text: 'Note what that buys you. Semantics instead of values: every component asks for the surface and stroke tokens, never for a raw hex code. A rebrand becomes a single file edit, and dark mode becomes a second declaration block rather than a second stylesheet.',
      },
      { type: 'h2', text: 'Then compose, never duplicate' },
      {
        type: 'p',
        text: 'Once the tokens are established, assemble components — buttons, inputs, cards — through composition. Scalability comes from nesting small pure modules rather than creating massive monolithic templates. A component that accepts a token and renders it can be reused forever; a component with a hard-coded colour value is technical debt the moment it is written.',
      },
      {
        type: 'quote',
        text: 'When your design tokens are solid, rebranding ten platforms takes five minutes, not five weeks.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Define the token contract first — names and semantics, agreed in writing.',
          'Compile tokens to every target the product ships on.',
          'Build primitives that consume tokens and nothing else.',
          'Add a lint rule that fails the build on raw colour values.',
        ],
      },
      {
        type: 'p',
        text: 'That fourth step is the one teams skip and the one that decides whether the system survives its first deadline. A convention without enforcement is a suggestion, and suggestions lose to shipping pressure every time.',
      },
    ],
  },
  {
    slug: 'form-function-brand',
    title: 'Balancing Form, Function, and Brand Narrative',
    displayTitle: 'Balancing Form, Function, and Brand',
    date: '2026-05-04',
    reviewed: '2026-07-15',
    image: '/journal/form-function-brand.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: 'Staircase, Cleveland Trust Company Building.jpg',
      author: 'w_lemay',
      licence: 'CC BY-SA 2.0',
      source:
        'https://commons.wikimedia.org/wiki/File:Staircase,_Cleveland_Trust_Company_Building,_Euclid_Avenue_and_East_9th_Street,_Cleveland,_OH_-_52990423418.jpg',
    },
    tags: ['Product', 'Brand', 'Engineering'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'Beautiful and broken, or fast and forgettable — both are failures. The craft is in the synthesis, and the synthesis is an engineering decision as much as a design one.',
    status: 'published',
    content: [
      {
        type: 'p',
        text: 'In the early days of the web, tech companies focused strictly on function: database queries, load times, and raw utility. Designers later focused strictly on form: gradients, drop shadows, and illustrative layouts. Today, premium software demands the seamless unification of both.',
      },
      {
        type: 'p',
        text: 'Form is how a product feels — its colour palettes, typography, micro-interactions, and visual harmony. Function is how it works — its database schemas, API latencies, and scalability. Brand narrative is the story it tells.',
      },
      { type: 'h2', text: 'Trust is a performance metric' },
      {
        type: 'p',
        text: 'When we engineered Vura Bank, we did not just build a secure account aggregation backend. We designed an interface that felt reassuring — deep dark surfaces, tight typographic rhythm, a state indicator that never guesses. The technical robustness was wrapped in an aesthetic that communicated stability, and the result was trust that users could feel before they could explain it.',
      },
      {
        type: 'quote',
        text: 'A fast application that looks outdated loses users. A beautiful application that is slow or insecure fails completely.',
      },
      {
        type: 'p',
        text: 'This is why the two disciplines cannot be sequenced. Form is not a polish pass applied after the function is finished, and function is not a concern deferred until after the design is signed off. Both are constrained by the same decisions: what the data model permits, what the render budget allows, what the brand can credibly claim.',
      },
      {
        type: 'list',
        items: [
          'Latency is a design material — it sets the ceiling for how expressive an interaction can be.',
          'Empty and error states carry more brand weight than the happy path ever will.',
          'Accessibility is not a constraint on craft; it is the definition of it.',
          'Performance budgets belong in the design review, not just the build pipeline.',
        ],
      },
      {
        type: 'p',
        text: 'As software creators we should refuse to compromise on either side of the spectrum. The magic is in the synthesis, and the synthesis is the actual job.',
      },
    ],
  },
  {
    slug: 'writing-for-the-web',
    title: 'Writing for the Web: Editing Is the Design',
    displayTitle: 'Writing for the Web: Editing Is the Design',
    date: '2026-04-02',
    reviewed: '2026-08-01',
    image: '/journal/writing-for-the-web.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: "Noodler's Black fountain pen ink writing samples.jpg",
      author: 'Wikimedia Commons contributor',
      licence: 'CC BY-SA 4.0',
      source:
        'https://commons.wikimedia.org/wiki/File:Noodler%27s_Black_fountain_pen_ink_writing_samples.jpg',
    },
    tags: ['Writing', 'Design', 'Product'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'Interface copy is the interface. Most layout problems I have been handed turned out to be editing problems wearing a layout costume.',
    status: 'published',
    content: [
      {
        type: 'p',
        text: 'Every layout problem I have been asked to solve in the last year was, on inspection, an editing problem wearing a layout costume. Too much copy does not need a bigger container; it needs a shorter sentence.',
      },
      { type: 'h2', text: 'Words set the grid' },
      {
        type: 'p',
        text: 'A paragraph is a design element with a variable height, an irregular rhythm, and no respect for your baseline grid. Writers decide how a page breathes long before a designer opens a canvas. This is why the strongest design teams I have worked with keep writing inside the design process rather than downstream of it.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Cut the first sentence. It is almost always the warm-up, not the argument.',
          'Replace adjectives with numbers wherever a number exists.',
          'Give every heading a job: scanning, not decoration.',
          'Read it aloud once. The ear catches what the eye forgives.',
        ],
      },
      {
        type: 'quote',
        text: 'Editing is design. The delete key is the most underrated typographic tool.',
      },
      {
        type: 'p',
        text: 'Applied here, it means page titles that fit on one line, list rows that do not truncate mid-word, and descriptions that tell you whether to click rather than trying to convince you to. Restraint in copy and restraint in layout are the same instinct pointed at different materials.',
      },
      {
        type: 'p',
        text: 'The practical discipline is version control for prose. Keep drafts, keep the cut lines in a comments block, review your own posts months later. A sentence that survives a six-month re-read has earned its place.',
      },
    ],
  },
  {
    slug: 'interface-performance-as-craft',
    title: 'Interface Performance Is a Design Decision',
    displayTitle: 'Interface Performance Is a Design Decision',
    date: '2026-03-11',
    reviewed: '2026-07-02',
    image: '/journal/interface-performance.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: 'Traffic light trails in LA (Unsplash).jpg',
      author: 'Kyle Murfin',
      licence: 'CC0',
      source:
        'https://commons.wikimedia.org/wiki/File:Traffic_light_trails_in_LA_(Unsplash).jpg',
    },
    tags: ['Engineering', 'Performance', 'UX'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'Every interaction that ships commits to a render budget. Decide the budget in the design phase, or the browser will decide it for you.',
    status: 'published',
    content: [
      {
        type: 'p',
        text: 'Performance is usually treated as an engineering afterthought — something to be profiled once the design is signed off and someone notices the frame rate dropping. By then the expensive decisions are already baked in.',
      },
      {
        type: 'p',
        text: 'A design commits to a render budget the moment it specifies a full-bleed video background, a parallax plate, or twelve simultaneous entrance animations. None of those are wrong. All of them are expensive, and the cost has to be paid somewhere.',
      },
      { type: 'h2', text: 'Composited or reflowed' },
      {
        type: 'p',
        text: 'The single most useful question to ask of any motion in a design review: does this animate a compositor property, or does it force layout? Transform and opacity can run on the GPU. Animating width, top, or margin asks the browser to recompute geometry on every frame.',
      },
      {
        type: 'code',
        language: 'css',
        filename: 'prefer-compositor-properties.css',
        code: `/* Reflows on every frame — geometry is recomputed */
.card:hover {
  width: 320px;
  margin-left: 12px;
}

/* Composited — the GPU moves an already-laid-out layer */
.card:hover {
  transform: translateX(12px) scale(1.02);
}`,
      },
      {
        type: 'p',
        text: 'That distinction is invisible on a fast machine with a small dataset and catastrophic on a mid-range Android with a large one. Since emerging markets are where most of my work ships, I design for the second environment and treat the first as a bonus.',
      },
      {
        type: 'list',
        items: [
          'Skeleton or reserve space for every image; never let layout shift after paint.',
          'Defer below-the-fold media instead of preloading everything.',
          'Measure on throttled hardware, not an office laptop.',
          'Treat a dropped frame as a bug with a ticket, not a nitpick.',
        ],
      },
      {
        type: 'quote',
        text: 'A dropped frame is a broken promise. The user asked for motion and received a slideshow.',
      },
      {
        type: 'p',
        text: 'Held consistently, that standard stops being a constraint on the design and starts being part of it. The most confident interfaces I have built are also the ones with the fewest simultaneous moving parts — restraint and speed turn out to be the same decision viewed from two angles.',
      },
    ],
  },
  {
    slug: 'ai-assisted-engineering',
    title: 'Notes on AI-assisted Engineering Without Losing the Craft',
    displayTitle: 'AI-assisted Engineering Without Losing Craft',
    date: '2026-02-18',
    reviewed: '2026-06-20',
    image: '/journal/ai-assisted-engineering.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: 'Macro circuit board.JPG',
      author: 'Wikimedia Commons contributor',
      licence: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Macro_circuit_board.JPG',
    },
    tags: ['Engineering', 'Process', 'AI'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'Generated code is a draft, not a decision. The parts of this job that resist automation are exactly the parts that were always the job.',
    status: 'published',
    content: [
      {
        type: 'p',
        text: 'I use AI assistance daily across Vura Bank, VEEDA, and Realssa. It has genuinely changed how quickly a first draft appears. It has not changed what I am responsible for, and pretending otherwise is how a codebase quietly fills up with plausible-looking decisions nobody made.',
      },
      { type: 'h2', text: 'A draft is not a decision' },
      {
        type: 'p',
        text: 'Generated code is a draft. It arrives confident, well-formatted, and unaware of your constraints — your data invariants, your error budgets, your users on a 3G connection in Lagos. Reviewing it means asking whether it is correct here, not whether it is generally correct.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Never accept an abstraction you cannot explain to a teammate without notes.',
          'Delete anything generated that has no caller. Dead code feels free and is not.',
          'Re-derive the tricky parts by hand — that is where the learning actually lives.',
          'Keep the review bar identical to a colleague’s pull request. Higher, if anything.',
        ],
      },
      {
        type: 'quote',
        text: 'The parts of this work that resist automation are the parts that were always the job.',
      },
      {
        type: 'p',
        text: 'What is left when boilerplate is free? Judgement about boundaries, taste in interface decisions, the ability to hold a whole system in your head, and the willingness to delete. Those were never mechanical skills, which is precisely why the tooling has not touched them.',
      },
      {
        type: 'p',
        text: 'So the honest accounting is a trade: you save the hours that were never the interesting part, and you are left with no excuse for being sloppy about the hours that are. That feels like a good deal, and also a slightly unforgiving one.',
      },
    ],
  },
  {
    slug: 'building-for-bandwidth',
    title: 'Building for Real Bandwidth: Lessons from Shipping in Nigeria',
    displayTitle: 'Building for Real Bandwidth Constraints',
    date: '2026-01-22',
    reviewed: '2026-05-30',
    image: '/journal/building-for-bandwidth.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: 'KRPI radio towers near Ferndale in sunset (34721481871).jpg',
      author: 'Wikimedia Commons contributor',
      licence: 'CC BY 2.0',
      source:
        'https://commons.wikimedia.org/wiki/File:KRPI_radio_towers_near_Ferndale_in_sunset_(34721481871).jpg',
    },
    tags: ['Engineering', 'Performance', 'Product'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'Designing for unreliable networks is not a compromise on quality. It is the most honest performance critique you will ever receive.',
    status: 'published',
    content: [
      {
        type: 'p',
        text: 'Shipping to readers across Nigeria taught me more about performance than any profiling session. On an unreliable connection the browser stops being forgiving, and every architectural shortcut you took becomes visible in a way it never is on fibre.',
      },
      {
        type: 'p',
        text: 'Realssa was the clearest lesson. A news reader who taps a story and waits nine seconds does not conclude that the network is slow. They conclude that your product is slow, and they leave without ever telling you why.',
      },
      { type: 'h2', text: 'Optimise the round trip, not just the payload' },
      {
        type: 'p',
        text: 'Payload size gets all the attention, but latency dominates on poor connections. Three requests of 20 KB each can easily be slower than one request of 200 KB, because the cost of the round trips compounds on top of the payload transfer.',
      },
      {
        type: 'list',
        items: [
          'One request beats three, even when the total bytes are higher.',
          'Serve text before imagery — never block reading on a photo.',
          'Cache aggressively and trust it; assume the second visit has no connection budget.',
          'Design an offline state that admits defeat gracefully instead of spinning forever.',
        ],
      },
      {
        type: 'quote',
        text: 'A spinner that never resolves is a lie told for as long as the user is willing to believe it.',
      },
      {
        type: 'p',
        text: 'The uncomfortable finding was that most of the cost was self-inflicted: hotlinked third-party images, unshrinkable bundles, fonts loaded twice. None of it was architectural sophistication. All of it was default behaviour that nobody had chosen on purpose.',
      },
      {
        type: 'p',
        text: 'Now I treat the constrained environment as the primary one. Designing for real bandwidth is not a compromise on quality — it is the most honest performance critique the product will ever receive, delivered free and continuously.',
      },
    ],
  },
  {
    slug: 'on-longevity',
    title: 'On Longevity: Building Products That Outlive Their Launch',
    displayTitle: 'On Longevity: Products That Outlive Launch',
    date: '2025-12-05',
    reviewed: '2026-04-10',
    image: '/journal/on-longevity.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: 'Eynsford Viaduct (1862) - Nine-arch red brick railway viaduct.jpg',
      author: 'Wikimedia Commons contributor',
      licence: 'CC BY 2.0',
      source:
        'https://commons.wikimedia.org/wiki/File:Eynsford_Viaduct_(1862)_-_Nine-arch_red_brick_railway_viaduct_spanning_the_Darent_Valley,_Kent,_England.jpg',
    },
    tags: ['Product', 'Process'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'Launch is the cheapest day in a product’s life. What survives is what was designed for maintenance by someone who was not in the room.',
    status: 'published',
    content: [
      {
        type: 'p',
        text: 'Launch day is the cheapest day in a product’s life. Everything is new, everyone is paying attention, and no decision has accumulated consequences yet. The expensive days arrive two years later, when the people who built it have moved on.',
      },
      {
        type: 'p',
        text: 'Most of the products I maintain started as someone’s exciting new thing. The ones that survived were not the ones with the best launches. They were the ones where somebody had optimised for the stranger who would inherit the code.',
      },
      { type: 'h2', text: 'Write for the person who is not in the room' },
      {
        type: 'list',
        items: [
          'A decision without a recorded reason gets reversed by whoever is annoyed by it next.',
          'Semantic names outlive fashionable ones; data never survives a refactor as well as a role does.',
          'Fewer dependencies is a maintenance strategy, not a personality trait.',
          'A boring solution a stranger can debug beats a clever one only you can.',
        ],
      },
      {
        type: 'p',
        text: 'None of that is glamorous, and none of it shows in a screenshot. It shows up in year three, when a change that should take an afternoon takes an afternoon instead of a quarter.',
      },
      {
        type: 'quote',
        text: 'Optimise for the person maintaining it, not the person demoing it.',
      },
      {
        type: 'p',
        text: 'I have been both people — the one who shipped something clever under deadline and the one who inherited it and cursed the cleverness. That experience shapes my architecture decisions more than any pattern catalogue, and it is the reason this portfolio is built from a handful of files somebody else could pick up tomorrow.',
      },
    ],
  },
  {
    slug: 'reading-data-not-vibes',
    title: 'Reading the Data Instead of the Vibes',
    displayTitle: 'Reading the Data Instead of the Vibes',
    date: '2025-10-24',
    reviewed: '2026-03-18',
    image: '/journal/reading-data.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: {
      file: "Interferometer, night of the open domes, Cote d'Azur Observatory.jpg",
      author: 'Wikimedia Commons contributor',
      licence: 'CC BY-SA 4.0',
      source:
        "https://commons.wikimedia.org/wiki/File:Interferometer,_night_of_the_open_domes,_Cote_d%27Azur_Observatory,_Calern_plateau,_France.jpg",
    },
    tags: ['Product', 'Analytics', 'UX'],
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    summary:
      'Opinions about interfaces are cheap and abundant. A funnel that is honest about where people leave is worth ten design reviews.',
    status: 'draft',
    content: [
      {
        type: 'p',
        text: 'Design reviews are delightful because they are conversations about taste between people who enjoy having them. They are also, frequently, a way for a team to avoid looking at a number that would settle the argument instantly.',
      },
      {
        type: 'p',
        text: 'I have watched a landing page be redesigned three times to much acclaim, while a single form field sat there quietly losing forty percent of users. Nobody had an opinion about the field because it was not visually interesting.',
      },
      { type: 'h2', text: 'Find the leak before you debate the paint' },
      {
        type: 'list',
        items: [
          'Instrument the drop-off points before touching the aesthetic.',
          'Measure completion, not impressions; a view is not an intention.',
          'Segment by connection quality and device class — averages hide everyone.',
          'Read the support messages. They are unstructured, and they are honest.',
        ],
      },
      {
        type: 'quote',
        text: 'A funnel chart does not have taste, which is exactly why it is a useful second opinion.',
      },
      {
        type: 'p',
        text: 'This is not an argument against craft. Craft is how you convert intent into completion once you know where intent is being lost. The two disciplines answer different questions, and using either one for the other’s question is how products end up both overdesigned and underperforming.',
      },
      {
        type: 'p',
        text: 'Draft note: this one is still missing the Realssa numbers, which I want to verify before publishing. Hold until the instrumentation review lands.',
      },
    ],
  },
]

/**
 * Reading time is derived here rather than authored, so the number on screen
 * can never drift away from the number of words actually written.
 */
export const JOURNAL_ENTRIES: JournalEntry[] = ENTRIES.map((entry) => ({
  ...entry,
  readTime: getReadTime(entry),
}))
