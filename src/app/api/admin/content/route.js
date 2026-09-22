import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

function getAuthenticatedUser(request) {
  const session = request.cookies.get('admin_session')?.value;
  return verifyToken(session);
}

async function cleanupDeletedImages(db, collectionName, newData, keyField = 'title') {
  try {
    const existing = await db.collection(collectionName).find({}).toArray();
    const deletedItems = existing.filter(item => {
      return !newData.some(newItem => newItem[keyField] === item[keyField]);
    });

    for (const item of deletedItems) {
      if (item.image && item.image.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', item.image);
        try {
          await fs.unlink(filePath);
          console.log(`Deleted local file: ${filePath}`);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            console.error(`Failed to delete local file: ${filePath}`, err);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Cleanup images error for ${collectionName}:`, error);
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const products = await db.collection('products').find({}).toArray();
    const clientProjects = await db.collection('portfolio').find({}).toArray();
    const services = await db.collection('services').find({}).toArray();
    const aboutArray = await db.collection('about').find({}).toArray();
    const about = aboutArray[0] || {};
    const contactArray = await db.collection('contact').find({}).toArray();
    const contact = contactArray[0] || {};

    return NextResponse.json({
      products,
      clientProjects,
      services,
      about,
      contact
    });
  } catch (error) {
    console.error('Fetch content error:', error);
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, data } = body;
    const { db } = await connectToDatabase();

    if (type === 'products') {
      const cleanData = Array.isArray(data) ? data.map(({ _id, ...item }) => item) : [];
      await cleanupDeletedImages(db, 'products', cleanData);
      await db.collection('products').deleteMany({});
      if (cleanData.length > 0) {
        await db.collection('products').insertMany(cleanData);
      }
    } else if (type === 'portfolio') {
      const cleanData = Array.isArray(data) ? data.map(({ _id, ...item }) => item) : [];
      await cleanupDeletedImages(db, 'portfolio', cleanData);
      await db.collection('portfolio').deleteMany({});
      if (cleanData.length > 0) {
        await db.collection('portfolio').insertMany(cleanData);
      }
    } else if (type === 'services') {
      await db.collection('services').deleteMany({});
      if (Array.isArray(data) && data.length > 0) {
        const cleanData = data.map(({ _id, ...item }) => item);
        await db.collection('services').insertMany(cleanData);
      }
    } else if (type === 'about') {
      await db.collection('about').deleteMany({});
      const { _id, ...cleanAbout } = data;
      await db.collection('about').insertOne(cleanAbout);
    } else if (type === 'contact') {
      await db.collection('contact').deleteMany({});
      const { _id, ...cleanContact } = data;
      await db.collection('contact').insertOne(cleanContact);
    } else {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
