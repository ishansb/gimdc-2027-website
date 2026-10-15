/**
 * VENUE & TRAVEL
 */
import type { Status } from './types.ts';

export const venueIntro = {
  heading: 'Venue & Travel',
  lead: 'GIMDC 2027 is proposed to be held at the campus of Goa Institute of Management.',
};

export const venue = {
  name: 'Goa Institute of Management',
  campus: 'Sanquelim Campus',
  addressLines: ['Poriem, Sattari', 'Goa 403505, India'],
  /** A map link. Uses a plain search link so no map is embedded (no tracking). */
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Goa+Institute+of+Management+Sanquelim+Poriem+Sattari+Goa+403505',
  status: 'proposed' as Status,
};

export interface InfoBlock {
  title: string;
  text: string;
  status: Status;
}

export const travelBlocks: InfoBlock[] = [
  {
    title: 'How to reach',
    text: 'Directions, including air and rail connections to the campus, will be published with the final programme.',
    status: 'coming-soon',
  },
  {
    title: 'Accommodation',
    text: 'Accommodation is proposed at ₹800 per night including meals. Availability and booking arrangements will be confirmed before registration opens.',
    status: 'proposed',
  },
  {
    title: 'Travel information',
    text: 'Guidance on local transport, visas for international participants and travel planning will be shared closer to the conference.',
    status: 'coming-soon',
  },
];
