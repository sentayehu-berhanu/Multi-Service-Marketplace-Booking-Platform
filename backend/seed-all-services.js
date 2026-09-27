const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categoryServicesMap = {
  'barber': [
    { name: 'Classic Fade', description: 'Clean and sharp fade with hot towel.', price: 250, duration: 40, image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80' },
    { name: 'Beard Trim & Shape', description: 'Precision beard shaping.', price: 150, duration: 20, image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Kids Haircut', description: 'Gentle haircut for kids.', price: 200, duration: 30, image: 'https://images.unsplash.com/photo-1588774069410-86aeae9e782e?auto=format&fit=crop&w=400&q=80' }
  ],
  'womens-salon': [
    { name: 'Full Hair Coloring', description: 'Premium dye and styling.', price: 1500, duration: 120, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80' },
    { name: 'Bridal Makeup', description: 'Full makeup for the special day.', price: 2500, duration: 90, image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Manicure & Pedicure', description: 'Complete nail care.', price: 600, duration: 60, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80' }
  ],
  'cosmetics': [
    { name: 'Premium Foundation', description: 'Flawless coverage foundation.', price: 800, duration: 0, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80' },
    { name: 'Hydrating Face Serum', description: 'Vitamin C enriched serum.', price: 1200, duration: 0, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' }
  ],
  'parking': [
    { name: 'Standard Daily Parking', description: 'Secure 24-hour parking.', price: 50, duration: 1440, image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=400&q=80' },
    { name: 'VIP Covered Parking', description: 'Reserved spot with shade.', price: 150, duration: 1440, image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=400&q=80' }
  ],
  'pharmacy': [
    { name: 'Health Consultation', description: 'Consult with pharmacist.', price: 200, duration: 30, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80' },
    { name: 'Blood Pressure Check', description: 'Quick vital check.', price: 50, duration: 10, image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=400&q=80' }
  ],
  'cafe': [
    { name: 'Specialty Macchiato', description: 'Authentic Ethiopian coffee.', price: 60, duration: 15, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80' },
    { name: 'Avocado Juice', description: 'Freshly blended avocado.', price: 120, duration: 10, image: 'https://images.unsplash.com/photo-1623065422900-058229b9f7de?auto=format&fit=crop&w=400&q=80' }
  ],
  'restaurant': [
    { name: 'Table Reservation (2 pax)', description: 'Romantic dinner table.', price: 200, duration: 120, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' },
    { name: 'Beyaynetu (Fasting Combo)', description: 'Traditional vegan dish.', price: 350, duration: 45, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=400&q=80' }
  ],
  'spa': [
    { name: 'Deep Tissue Massage', description: 'Full body relaxation.', price: 1500, duration: 90, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80' },
    { name: 'Moroccan Bath', description: 'Exfoliating bath experience.', price: 2000, duration: 120, image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=400&q=80' }
  ],
  'car-wash': [
    { name: 'Full Body Wash', description: 'Exterior and interior cleaning.', price: 400, duration: 45, image: 'https://images.unsplash.com/photo-1605333605663-12e03c004d80?auto=format&fit=crop&w=400&q=80' },
    { name: 'Engine Detailing', description: 'Deep engine clean.', price: 800, duration: 60, image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=80' }
  ],
  'gym': [
    { name: 'Monthly Membership', description: 'Unlimited access.', price: 2000, duration: 30, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80' },
    { name: 'Personal Training Session', description: '1-on-1 coaching.', price: 500, duration: 60, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80' }
  ],
  'cleaning': [
    { name: 'Deep Home Cleaning', description: 'Thorough cleaning for 3 bedrooms.', price: 1500, duration: 240, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80' },
    { name: 'Sofa Dry Cleaning', description: 'Stain removal for living room sofa.', price: 800, duration: 90, image: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&w=400&q=80' }
  ],
  'home-repair': [
    { name: 'Plumbing Service', description: 'Fix leaks and pipes.', price: 500, duration: 60, image: 'https://images.unsplash.com/photo-1607472586893-edb57cb5b282?auto=format&fit=crop&w=400&q=80' },
    { name: 'Electrical Repair', description: 'Wiring and fixing faults.', price: 600, duration: 60, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=400&q=80' }
  ],
  'hotel': [
    { name: 'Standard Room Night', description: 'Cozy room for 2.', price: 3000, duration: 1440, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80' },
    { name: 'Deluxe Suite', description: 'Luxury suite with view.', price: 6000, duration: 1440, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80' }
  ],
  'healthcare': [
    { name: 'General Consultation', description: 'Meet with a physician.', price: 600, duration: 30, image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=400&q=80' },
    { name: 'Dental Checkup', description: 'Full dental examination.', price: 800, duration: 45, image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80' }
  ],
  'tutors': [
    { name: 'Math Tutoring', description: 'High school math help.', price: 400, duration: 60, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80' },
    { name: 'English Language Class', description: 'IELTS preparation.', price: 500, duration: 90, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80' }
  ],
  'transportation': [
    { name: 'Airport Transfer', description: 'Ride to Bole Airport.', price: 1200, duration: 60, image: 'https://images.unsplash.com/photo-1512130386616-56360c70d4ab?auto=format&fit=crop&w=400&q=80' },
    { name: 'Full Day City Tour', description: 'Chauffeured Addis tour.', price: 4000, duration: 480, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=400&q=80' }
  ],
  'local-delivery': [
    { name: 'Document Courier', description: 'Fast document delivery.', price: 150, duration: 30, image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c663be?auto=format&fit=crop&w=400&q=80' },
    { name: 'Heavy Package Delivery', description: 'Up to 50kg.', price: 500, duration: 120, image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=400&q=80' }
  ],
  'events-tickets': [
    { name: 'VIP Concert Ticket', description: 'Front row access.', price: 1500, duration: 180, image: 'https://images.unsplash.com/photo-1540039155732-68c3cb070335?auto=format&fit=crop&w=400&q=80' },
    { name: 'Networking Event Pass', description: 'Business networking.', price: 500, duration: 120, image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80' }
  ]
};

async function seedAllServices() {
  const categories = await prisma.category.findMany({
    include: { businesses: true }
  });

  for (const category of categories) {
    const defaultServices = categoryServicesMap[category.slug];
    if (!defaultServices) continue;

    // Pick first 3 businesses of this category
    const targetBusinesses = category.businesses.slice(0, 3);
    
    for (const biz of targetBusinesses) {
      // Create some variation for each business
      for (const [index, ds] of defaultServices.entries()) {
        const uniqueImage = ds.image;
        
        // Check if a service with similar name exists for this biz
        const exists = await prisma.service.findFirst({
          where: { business_id: biz.id, name: ds.name }
        });

        if (!exists) {
          await prisma.service.create({
            data: {
              business_id: biz.id,
              name: ds.name,
              description: ds.description,
              price: ds.price + (Math.floor(Math.random() * 5) * 10), // slight price variation
              duration: ds.duration,
              image: uniqueImage,
              status: 'ACTIVE'
            }
          });
        } else {
            await prisma.service.update({
                where: { id: exists.id },
                data: { image: uniqueImage } // ensure image is updated
            })
        }
      }
    }
    console.log(`Seeded services for category: ${category.name}`);
  }
  
  console.log('Finished seeding all services!');
}

seedAllServices()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
