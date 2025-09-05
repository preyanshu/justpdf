import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, rm, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';
import { execAsync } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const splitMode = formData.get('splitMode') as string || 'pages';
    const pageNumbers = formData.get('pageNumbers') as string || '';
    const pagesPerSplit = formData.get('pagesPerSplit') as string || '1';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(`Splitting PDF: ${file.name}, Mode: ${splitMode}`);

    // Create temporary directory
    const tempDir = `/tmp/pdf-split-${randomUUID()}`;
    await mkdir(tempDir, { recursive: true });

    try {
      // Save the input PDF
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const inputPath = `${tempDir}/input.pdf`;
      await writeFile(inputPath, fileBuffer);

      let outputFiles: string[] = [];

      if (splitMode === 'pages') {
        // Split by specific pages
        const pages = pageNumbers.split(',').map(p => p.trim()).filter(p => p);
        
        if (pages.length === 0) {
          return NextResponse.json({ error: 'No page numbers provided' }, { status: 400 });
        }

        for (let i = 0; i < pages.length; i++) {
          const pageNum = pages[i];
          const outputPath = `${tempDir}/page-${pageNum}.pdf`;
          const splitCommand = `qpdf "${inputPath}" --pages . ${pageNum} -- "${outputPath}"`;
          
          try {
            await execAsync(splitCommand);
            outputFiles.push(outputPath);
            console.log(`Extracted page ${pageNum}`);
          } catch (error) {
            console.error(`Failed to extract page ${pageNum}:`, error);
          }
        }
      } else {
        // Split by pages per file
        const pagesPerFile = parseInt(pagesPerSplit);
        
        if (isNaN(pagesPerFile) || pagesPerFile < 1) {
          return NextResponse.json({ error: 'Invalid pages per split value' }, { status: 400 });
        }

        // First, get the total number of pages
        const infoCommand = `qpdf --show-npages "${inputPath}"`;
        const pageCountResult = await execAsync(infoCommand);
        const totalPages = parseInt(pageCountResult.trim());

        // Split into chunks
        for (let startPage = 1; startPage <= totalPages; startPage += pagesPerFile) {
          const endPage = Math.min(startPage + pagesPerFile - 1, totalPages);
          const outputPath = `${tempDir}/split-${startPage}-${endPage}.pdf`;
          const splitCommand = `qpdf "${inputPath}" --pages . ${startPage}-${endPage} -- "${outputPath}"`;
          
          try {
            await execAsync(splitCommand);
            outputFiles.push(outputPath);
            console.log(`Created split ${startPage}-${endPage}`);
          } catch (error) {
            console.error(`Failed to create split ${startPage}-${endPage}:`, error);
          }
        }
      }

      if (outputFiles.length === 0) {
        return NextResponse.json({ error: 'No pages could be extracted' }, { status: 500 });
      }

      // Create a zip file with all the split PDFs
      const zipPath = `${tempDir}/split-pdfs.zip`;
      const zipCommand = `cd "${tempDir}" && zip -r split-pdfs.zip *.pdf`;
      
      try {
        await execAsync(zipCommand);
        console.log('Created zip file with split PDFs');
      } catch (error) {
        console.error('Failed to create zip file:', error);
        // If zip fails, return the first PDF
        const firstPdf = await readFile(outputFiles[0]);
        await rm(tempDir, { recursive: true, force: true });
        
        return new NextResponse(firstPdf, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="split-page-1.pdf"',
          },
        });
      }

      // Read the zip file
      const zipBuffer = await readFile(zipPath);
      
      // Clean up
      await rm(tempDir, { recursive: true, force: true });

      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="split-pdfs.zip"',
        },
      });

    } catch (error) {
      console.error('PDF split error:', error);
      
      // Clean up on error
      await rm(tempDir, { recursive: true, force: true });
      
      return NextResponse.json(
        { error: 'PDF split failed. Please ensure qpdf is installed.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('PDF split API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
