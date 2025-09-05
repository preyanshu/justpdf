import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, rm, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';
import { execAsync } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pagesToRemove = formData.get('pagesToRemove') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!pagesToRemove || pagesToRemove.trim() === '') {
      return NextResponse.json({ error: 'No pages specified for removal' }, { status: 400 });
    }

    console.log(`Removing pages from PDF: ${file.name}, Pages: ${pagesToRemove}`);

    // Create temporary directory
    const tempDir = `/tmp/pdf-remove-pages-${randomUUID()}`;
    await mkdir(tempDir, { recursive: true });

    try {
      // Save the input PDF
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const inputPath = `${tempDir}/input.pdf`;
      await writeFile(inputPath, fileBuffer);

      // Parse page numbers to remove
      const pagesToRemoveArray = pagesToRemove.split(',').map(p => p.trim()).filter(p => p);
      
      if (pagesToRemoveArray.length === 0) {
        return NextResponse.json({ error: 'No valid page numbers provided' }, { status: 400 });
      }

      // Get total number of pages
      const infoCommand = `qpdf --show-npages "${inputPath}"`;
      const pageCountResult = await execAsync(infoCommand);
      const totalPages = parseInt(pageCountResult.trim());

      // Create list of pages to keep
      const pagesToKeep: number[] = [];
      for (let i = 1; i <= totalPages; i++) {
        if (!pagesToRemoveArray.includes(i.toString())) {
          pagesToKeep.push(i);
        }
      }

      if (pagesToKeep.length === 0) {
        return NextResponse.json({ error: 'Cannot remove all pages from the PDF' }, { status: 400 });
      }

      // Create the output PDF with remaining pages
      const outputPath = `${tempDir}/output.pdf`;
      const pagesList = pagesToKeep.join(',');
      const removeCommand = `qpdf "${inputPath}" --pages . ${pagesList} -- "${outputPath}"`;
      
      try {
        await execAsync(removeCommand);
        console.log(`Successfully removed pages: ${pagesToRemoveArray.join(', ')}`);
        console.log(`Remaining pages: ${pagesToKeep.join(', ')}`);
      } catch (error) {
        console.error('Failed to remove pages:', error);
        throw new Error('Failed to remove specified pages');
      }

      // Read the output PDF
      const pdfBuffer = await readFile(outputPath);
      
      // Clean up
      await rm(tempDir, { recursive: true, force: true });

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="pages-removed.pdf"',
        },
      });

    } catch (error) {
      console.error('PDF page removal error:', error);
      
      // Clean up on error
      await rm(tempDir, { recursive: true, force: true });
      
      return NextResponse.json(
        { error: 'PDF page removal failed. Please ensure qpdf is installed.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('PDF remove pages API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
