import { connectToDatabase } from './mongodb';
import { initialContent } from './initialData';

export async function getWebsiteContent() {
  try {
    const { db } = await connectToDatabase();
    
    const dbProducts = await db.collection('products').find({}).toArray();
    const dbPortfolio = await db.collection('portfolio').find({}).toArray();
    const dbServices = await db.collection('services').find({}).toArray();
    const dbAboutArray = await db.collection('about').find({}).toArray();
    const dbContactArray = await db.collection('contact').find({}).toArray();
    
    // Clean up MongoDB IDs (_id field) to prevent Next.js serialization warnings
    const cleanProducts = dbProducts.map(({ _id, ...item }) => item);
    const cleanPortfolio = dbPortfolio.map(({ _id, ...item }) => item);
    const cleanServices = dbServices.map(({ _id, ...item }) => item);
    
    let cleanAbout = initialContent.about;
    if (dbAboutArray[0]) {
      const { _id, ...rest } = dbAboutArray[0];
      cleanAbout = rest;
    }

    let cleanContact = initialContent.contact;
    if (dbContactArray[0]) {
      const { _id, ...rest } = dbContactArray[0];
      cleanContact = rest;
    }
    
    return {
      products: cleanProducts.length > 0 ? cleanProducts : initialContent.products,
      clientProjects: cleanPortfolio.length > 0 ? cleanPortfolio : initialContent.clientProjects,
      services: cleanServices.length > 0 ? cleanServices : initialContent.services,
      about: cleanAbout,
      contact: cleanContact
    };
  } catch (error) {
    console.warn('MongoDB connection failed or is not configured. Falling back to initialContent data.', error.message);
    return {
      products: initialContent.products,
      clientProjects: initialContent.clientProjects,
      services: initialContent.services,
      about: initialContent.about,
      contact: initialContent.contact
    };
  }
}
