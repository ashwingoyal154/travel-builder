// Prompt library — single source of truth for world-map paths and
// the Continent → Country → Prompt taxonomy.

export const WORLD_MAP_PATHS = [
  // North America
  'M 80 80 L 180 60 L 220 90 L 245 135 L 215 185 L 175 230 L 145 250 L 100 205 L 68 155 Z',
  // South America
  'M 155 265 L 200 252 L 225 280 L 235 345 L 215 405 L 185 428 L 158 396 L 148 340 L 152 295 Z',
  // Europe
  'M 425 58 L 515 52 L 538 78 L 528 125 L 496 145 L 448 133 L 418 102 Z',
  // Africa
  'M 438 162 L 512 152 L 542 182 L 554 254 L 532 336 L 490 375 L 458 343 L 437 272 L 428 202 Z',
  // Asia
  'M 540 48 L 705 38 L 808 68 L 835 122 L 805 175 L 722 185 L 640 165 L 568 142 L 538 100 Z',
  // Australia
  'M 718 282 L 802 270 L 845 302 L 843 364 L 800 384 L 738 372 L 706 332 Z',
]

export const CONTINENTS = [
  {
    id: 'north-america',
    name: 'North America',
    mapPathIndex: 0,
    countries: [
      {
        name: 'United States',
        prompts: [
          'Jazz-age immersion in New Orleans',
          'Route 66 desert road trip',
          'National parks of the American West',
        ],
      },
      {
        name: 'Mexico',
        prompts: [
          'Día de los Muertos in Oaxaca',
          'Yucatán cenotes & Maya ruins',
        ],
      },
    ],
  },
  {
    id: 'south-america',
    name: 'South America',
    mapPathIndex: 1,
    comingSoon: true,
    countries: [],
  },
  {
    id: 'europe',
    name: 'Europe',
    mapPathIndex: 2,
    countries: [
      {
        name: 'Italy',
        prompts: [
          'Renaissance art pilgrimage through Florence',
          'Slow-food road trip across Tuscany',
          'Roman ruins after dark',
        ],
      },
      {
        name: 'France',
        prompts: [
          'Impressionist trails of Provence',
          'Loire Valley château wine route',
        ],
      },
      {
        name: 'Iceland',
        prompts: [
          'Northern lights & geothermal springs',
          'Viking heritage saga trail',
        ],
      },
    ],
  },
  {
    id: 'africa',
    name: 'Africa',
    mapPathIndex: 3,
    countries: [
      {
        name: 'Morocco',
        prompts: [
          'Imperial cities & Sahara nights',
          'Atlas Mountains Berber villages',
        ],
      },
      {
        name: 'Egypt',
        prompts: [
          'Nile cruise through the ancient dynasties',
          'Temples of Luxor & the Valley of the Kings',
        ],
      },
    ],
  },
  {
    id: 'asia',
    name: 'Asia',
    mapPathIndex: 4,
    countries: [
      {
        name: 'Japan',
        prompts: [
          'Cherry blossom season immersion',
          'Ancient temple trail in Kyoto',
          'Tokyo neon nightlife crawl',
        ],
      },
      {
        name: 'Vietnam',
        prompts: [
          'Street-food odyssey, Hanoi to Saigon',
          'Halong Bay slow cruise',
        ],
      },
      {
        name: 'Uzbekistan',
        prompts: [
          'Ancient Silk Road cities overland',
          'Blue-tiled madrasas of Samarkand & Bukhara',
        ],
      },
    ],
  },
  {
    id: 'oceania',
    name: 'Oceania',
    mapPathIndex: 5,
    comingSoon: true,
    countries: [],
  },
]
