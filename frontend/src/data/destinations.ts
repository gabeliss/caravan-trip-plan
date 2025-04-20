import { Destination } from '../types';

export const destinations: Destination[] = [
  {
    id: 'northern-michigan',
    name: 'Northern Michigan',
    description: 'Discover pristine lakeshores, dense forests, and historic lighthouses along Michigan\'s stunning northern coast.',
    imageUrl: 'https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742762135/images-caravan/explorepage/cijn5goy6wwawmrmvswc.jpg',
    region: 'Midwest',
    highlights: ['Sleeping Bear Dunes', 'Mackinac Island', 'Traverse City', 'Pictured Rocks'],
    coordinates: [-85.6206, 44.7631]
  },
  {
    id: 'arizona',
    name: 'Arizona',
    description: 'Experience the majesty of the Southwest through red rock formations, desert landscapes, and the Grand Canyon.',
    imageUrl: 'https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742762162/images-caravan/landing-gallery/qnqmqbps00fxpc0isojk.jpg',
    region: 'Southwest',
    highlights: ['Grand Canyon', 'Sedona', 'Antelope Canyon', 'Monument Valley'],
    coordinates: [-111.0937, 34.0489]
  },
  {
    id: 'washington',
    name: 'Washington',
    description: 'Journey through the Pacific Northwest\'s diverse landscapes from the Cascades to Olympic National Park.',
    imageUrl: 'https://res.cloudinary.com/dmyrs1fbl/image/upload/v1743774400/DSC_0493_2_kzmatj.jpg',
    region: 'Pacific Northwest',
    highlights: ['Olympic National Park', 'Mount Rainier', 'San Juan Islands', 'North Cascades'],
    coordinates: [-121.5708, 47.7511]
  },
  {
    id: 'smoky-mountains',
    name: 'Smoky Mountains',
    description: 'Explore the ancient mountains of Appalachia with misty peaks, diverse wildlife, and rich cultural heritage.',
    imageUrl: 'https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742762138/images-caravan/trippage/e0tdvz5mlnno6jd9va7a.png',
    region: 'Southeast',
    highlights: ['Great Smoky Mountains National Park', 'Blue Ridge Parkway', 'Gatlinburg', 'Cherokee'],
    coordinates: [-83.5085, 35.6532]
  },
  {
    id: 'southern-california',
    name: 'Southern California',
    description: 'Experience the diverse landscapes of Southern California, from coastal highways to desert national parks.',
    imageUrl: 'https://res.cloudinary.com/dmyrs1fbl/image/upload/v1743774860/Screen_Shot_2025-04-04_at_9.53.53_AM_pp5jxi.png',
    region: 'West Coast',
    highlights: ['Joshua Tree', 'Death Valley', 'Pacific Coast Highway', 'Channel Islands'],
    coordinates: [-116.5463, 33.8734]
  }
];