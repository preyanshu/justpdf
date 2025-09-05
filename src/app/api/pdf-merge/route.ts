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

    if (files.length < 2) {
      return NextResponse.json({ error: 'At least 2 PDF files are required for merging' }, { status: 400 });
    }

    console.log(`Merging ${files.length} PDF files`);

    // Create temporary directory
    const tempDir = `/tmp/pdf-merge-${randomUUID()}`;
    await mkdir(tempDir, { recursive: true });

    try {
      const pdfPaths: string[] = [];

      // Save all PDF files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileName = `input-${i}.pdf`;
        const pdfPath = `${tempDir}/${fileName}`;
        
        await writeFile(pdfPath, fileBuffer);
        pdfPaths.push(pdfPath);
        console.log(`Saved ${file.name} as ${fileName}`);
      }

      // Merge PDFs using Ghostscript
      const outputPath = `${tempDir}/merged.pdf`;
      const pdfList = pdfPaths.map(p => `"${p}"`).join(' ');
      const mergeCommand = `gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile="${outputPath}" ${pdfList}`;
      
      try {
        await execAsync(mergeCommand);
        console.log('PDF merge completed successfully');
      } catch (mergeError) {
        console.error('PDF merge failed:', mergeError);
        
        // Try alternative method with qpdf
        const qpdfCommand = `qpdf --empty --pages ${pdfList} -- "${outputPath}"`;
        try {
          await execAsync(qpdfCommand);
          console.log('PDF merge completed with qpdf');
        } catch (qpdfError) {
          console.error('qpdf merge also failed:', qpdfError);
          throw new Error('PDF merge failed with both Ghostscript and qpdf');
        }
      }

      // Read the merged PDF
      const pdfBuffer = await readFile(outputPath);
      
      // Clean up
      await rm(tempDir, { recursive: true, force: true });

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="merged.pdf"',
        },
      });

    } catch (error) {
      console.error('PDF merge error:', error);
      
      // Clean up on error
      await rm(tempDir, { recursive: true, force: true });
      
      return NextResponse.json(
        { error: 'PDF merge failed. Please ensure Ghostscript and qpdf are installed.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('PDF merge API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
