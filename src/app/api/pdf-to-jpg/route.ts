import { NextRequest, NextResponse } from 'next/server';
import { fromBuffer } from 'pdf2pic';
import { writeFile, mkdir, rm, readFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  let tempDir = '';
  
  try {
    console.log('Request received, parsing form data...');
    const formData = await request.formData();
    console.log('Form data parsed successfully');
    
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Processing PDF file:', file.name, 'Size:', file.size);

    // Create a unique directory for this conversion
    const conversionId = randomUUID();
    tempDir = join('/tmp', `pdf-conversion-${conversionId}`);
    await mkdir(tempDir, { recursive: true });

    // Save the uploaded PDF to temp directory
    const pdfBuffer = Buffer.from(await file.arrayBuffer());
    const pdfPath = join(tempDir, 'input.pdf');
    await writeFile(pdfPath, pdfBuffer);

    console.log('PDF saved to:', pdfPath);

    // Configure pdf2pic options with more conservative settings
    const convert = fromBuffer(pdfBuffer, {
      density: 150, // Reduced DPI for better compatibility
      saveFilename: 'page',
      savePath: tempDir,
      format: 'jpeg',
      width: 1200, // Reduced resolution
      height: 1200,
      quality: 90,
      // Add additional options for better compatibility
      preserveAspectRatio: true,
      autoRotate: true
    });

    console.log('Starting PDF conversion...');

    // Convert all pages (-1 means all pages)
    const results = await convert.bulk(-1, { responseType: 'image' });
    
    console.log('Conversion completed. Results:', results.length);

    // Read the generated images
    const images = [];
    for (let i = 0; i < results.length; i++) {
      const imagePath = join(tempDir, `page.${i + 1}.jpeg`);
      try {
        const imageBuffer = await readFile(imagePath);
        images.push({
          page: i + 1,
          data: imageBuffer.toString('base64'),
          size: imageBuffer.length
        });
        console.log(`Page ${i + 1} converted successfully`);
      } catch (imageError) {
        console.error(`Failed to read page ${i + 1}:`, imageError);
        // Continue with other pages
      }
    }

    if (images.length === 0) {
      throw new Error('No images were generated from the PDF');
    }

    // Clean up temp directory
    await rm(tempDir, { recursive: true, force: true });

    console.log('Conversion successful, returning', images.length, 'images');

    return NextResponse.json({
      success: true,
      images,
      totalPages: images.length
    });

  } catch (error) {
    console.error('PDF to JPG conversion error:', error);
    
    // Clean up temp directory on error
    if (tempDir) {
      try {
        await rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup temp directory:', cleanupError);
      }
    }

    // Return more specific error messages
    let errorMessage = 'Failed to convert PDF to JPG images';
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        errorMessage = 'Required system dependencies (GraphicsMagick/Ghostscript) not found';
      } else if (error.message.includes('Invalid PDF')) {
        errorMessage = 'Invalid or corrupted PDF file';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password-protected PDF not supported';
      } else if (error.message.includes('FormData')) {
        errorMessage = 'Invalid file upload format';
      } else {
        errorMessage = `Conversion failed: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
