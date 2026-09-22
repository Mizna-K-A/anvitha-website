import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { verifyToken } from '@/lib/auth';

function getAuthenticatedUser(request) {
  const session = request.cookies.get('admin_session')?.value;
  return verifyToken(session);
}

export async function POST(request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size limit (under 1 MB = 1,048,576 bytes)
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size must be under 1 MB' }, { status: 400 });
    }

    // Validate image format
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and append unique timestamp
    const fileExtension = path.extname(file.name) || '.png';
    const baseName = path.basename(file.name, fileExtension).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${Date.now()}_${baseName}${fileExtension}`;

    // Target upload path: public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      path: `/uploads/${filename}` 
    });
  } catch (error) {
    console.error('File upload API error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
