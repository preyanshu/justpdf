import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, rm, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';
import { execAsync } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    console.log(`Processing ${files.length} image files`);

    // Create temporary directory
    const tempDir = `/tmp/image-to-pdf-${randomUUID()}`;
    await mkdir(tempDir, { recursive: true });

    try {
      const pdfPaths: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileName = `image-${i}.${file.name.split('.').pop()}`;
        const imagePath = `${tempDir}/${fileName}`;
        
        // Save image file
        await writeFile(imagePath, fileBuffer);
        
        // Convert image to PDF using ImageMagick
        const pdfPath = `${tempDir}/output-${i}.pdf`;
        const convertCommand = `convert "${imagePath}" "${pdfPath}"`;
        
        try {
          await execAsync(convertCommand);
          pdfPaths.push(pdfPath);
          console.log(`Converted ${file.name} to PDF`);
        } catch (convertError) {
          console.error(`Failed to convert ${file.name}:`, convertError);
          // Try with different format
          const fallbackCommand = `convert "${imagePath}" -density 300 -quality 100 "${pdfPath}"`;
          await execAsync(fallbackCommand);
          pdfPaths.push(pdfPath);
        }
      }

      // Merge all PDFs if multiple images
      let finalPdfPath: string;
      
      if (pdfPaths.length === 1) {
        finalPdfPath = pdfPaths[0];
      } else {
        finalPdfPath = `${tempDir}/merged.pdf`;
        const pdfList = pdfPaths.map(p => `"${p}"`).join(' ');
        const mergeCommand = `gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile="${finalPdfPath}" ${pdfList}`;
        
        try {
          await execAsync(mergeCommand);
        } catch (mergeError) {
          console.error('PDF merge failed, using first PDF:', mergeError);
          finalPdfPath = pdfPaths[0];
        }
      }

      // Read the final PDF
      const pdfBuffer = await readFile(finalPdfPath);
      
      // Clean up
      await rm(tempDir, { recursive: true, force: true });

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="converted.pdf"',
        },
      });

    } catch (error) {
      console.error('Image to PDF conversion error:', error);
      
      // Clean up on error
      await rm(tempDir, { recursive: true, force: true });
      
      return NextResponse.json(
        { error: 'Image to PDF conversion failed. Please ensure ImageMagick is installed.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image to PDF API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
