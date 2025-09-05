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

    console.log(`Processing ${files.length} JPEG files`);

    // Create temporary directory
    const tempDir = `/tmp/jpeg-to-pdf-${randomUUID()}`;
    await mkdir(tempDir, { recursive: true });

    try {
      const pdfPaths: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileName = `image-${i}.jpg`;
        const imagePath = `${tempDir}/${fileName}`;
        
        // Save JPEG file
        await writeFile(imagePath, fileBuffer);
        
        // Convert JPEG to PDF using ImageMagick
        const pdfPath = `${tempDir}/output-${i}.pdf`;
        const convertCommand = `convert "${imagePath}" -density 300 -quality 100 "${pdfPath}"`;
        
        try {
          await execAsync(convertCommand);
          pdfPaths.push(pdfPath);
          console.log(`Converted ${file.name} to PDF`);
        } catch (convertError) {
          console.error(`Failed to convert ${file.name}:`, convertError);
          return NextResponse.json(
            { error: 'JPEG to PDF conversion failed. Please ensure ImageMagick is installed.' },
            { status: 500 }
          );
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
      console.error('JPEG to PDF conversion error:', error);
      
      // Clean up on error
      await rm(tempDir, { recursive: true, force: true });
      
      return NextResponse.json(
        { error: 'JPEG to PDF conversion failed. Please ensure ImageMagick is installed.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('JPEG to PDF API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
