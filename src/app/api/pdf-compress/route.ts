import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, rm, readFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  let tempDir = '';
  
  try {
    console.log('Request received, parsing form data...');
    const formData = await request.formData();
    console.log('Form data parsed successfully');
    
    const file = formData.get('file') as File;
    const compressionLevel = formData.get('compressionLevel') as string || 'medium';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Processing PDF file:', file.name, 'Size:', file.size, 'Compression:', compressionLevel);

    // Create a unique directory for this conversion
    const conversionId = randomUUID();
    tempDir = join('/tmp', `pdf-compress-${conversionId}`);
    await mkdir(tempDir, { recursive: true });

    // Save the uploaded PDF to temp directory
    const pdfBuffer = Buffer.from(await file.arrayBuffer());
    const inputPath = join(tempDir, 'input.pdf');
    await writeFile(inputPath, pdfBuffer);

    console.log('PDF saved to:', inputPath);

    // Define compression settings based on level - more conservative approach
    let gsQuality = 'printer';
    let gsDpi = 300;
    let qpdfLevel = '--optimize-images --linearize';
    
    switch (compressionLevel) {
      case 'low':
        gsQuality = 'printer';
        gsDpi = 300;
        qpdfLevel = '--optimize-images --linearize';
        break;
      case 'medium':
        gsQuality = 'ebook';
        gsDpi = 200;
        qpdfLevel = '--optimize-images --compress-streams=y --linearize';
        break;
      case 'high':
        gsQuality = 'ebook';
        gsDpi = 150;
        qpdfLevel = '--optimize-images --compress-streams=y --linearize';
        break;
      case 'maximum':
        gsQuality = 'screen';
        gsDpi = 150;
        qpdfLevel = '--optimize-images --compress-streams=y --linearize';
        break;
    }

    const intermediatePath = join(tempDir, 'intermediate.pdf');
    const outputPath = join(tempDir, 'compressed.pdf');

    console.log('Starting PDF compression with Ghostscript...');

    // Step 1: Use Ghostscript for basic compression
    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${gsQuality} -dNOPAUSE -dQUIET -dBATCH -dColorImageResolution=${gsDpi} -dGrayImageResolution=${gsDpi} -dMonoImageResolution=${gsDpi} -dOptimize=true -dCompressFonts=true -dSubsetFonts=true -dEmbedAllFonts=false -sOutputFile="${intermediatePath}" "${inputPath}"`;
    
    console.log('Ghostscript command:', gsCommand);
    await execAsync(gsCommand);

    console.log('Ghostscript compression completed');

    // Check if the intermediate file was created and has reasonable size
    const intermediateStats = await import('fs').then(fs => fs.promises.stat(intermediatePath));
    console.log('Intermediate file size:', intermediateStats.size);

    // Step 2: Use qpdf for additional optimization
    console.log('Starting qpdf optimization...');
    const qpdfCommand = `qpdf ${qpdfLevel} "${intermediatePath}" "${outputPath}"`;
    
    console.log('qpdf command:', qpdfCommand);
    await execAsync(qpdfCommand);

    console.log('qpdf optimization completed');

    // Read the compressed PDF
    const compressedBuffer = await readFile(outputPath);
    const compressedSize = compressedBuffer.length;
    const originalSize = pdfBuffer.length;
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    console.log(`Compression completed. Original: ${originalSize} bytes, Compressed: ${compressedSize} bytes, Reduction: ${compressionRatio}%`);

    // Try a simpler approach if the first attempt didn't work well
    let finalBuffer = compressedBuffer;
    let finalSize = compressedSize;
    let finalRatio = compressionRatio;
    
    if (compressedSize > originalSize || compressionRatio < 5) {
      console.log('Trying simpler compression approach...');
      
      // Try a simpler Ghostscript-only approach
      const simpleGsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${gsQuality} -dNOPAUSE -dQUIET -dBATCH -dOptimize=true -sOutputFile="${outputPath}" "${inputPath}"`;
      
      try {
        await execAsync(simpleGsCommand);
        const simpleBuffer = await readFile(outputPath);
        const simpleSize = simpleBuffer.length;
        const simpleRatio = Math.round(((originalSize - simpleSize) / originalSize) * 100);
        
        console.log(`Simple compression: ${simpleSize} bytes, Reduction: ${simpleRatio}%`);
        
        // Use the better result
        if (simpleSize < originalSize && simpleSize < compressedSize) {
          finalBuffer = simpleBuffer;
          finalSize = simpleSize;
          finalRatio = simpleRatio;
          console.log('Using simple compression result');
        } else if (compressedSize < originalSize) {
          console.log('Using original compression result');
        } else {
          console.log('Compression not beneficial, using original file');
          finalBuffer = pdfBuffer;
          finalSize = originalSize;
          finalRatio = 0;
        }
      } catch (simpleError) {
        console.log('Simple compression failed, using original file');
        finalBuffer = pdfBuffer;
        finalSize = originalSize;
        finalRatio = 0;
      }
    }

    // Clean up temp directory
    await rm(tempDir, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      compressedPdf: finalBuffer.toString('base64'),
      originalSize,
      compressedSize: finalSize,
      compressionRatio: finalRatio,
      compressionLevel
    });

  } catch (error) {
    console.error('PDF compression error:', error);
    
    // Clean up temp directory on error
    if (tempDir) {
      try {
        await rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup temp directory:', cleanupError);
      }
    }

    // Return more specific error messages
    let errorMessage = 'Failed to compress PDF';
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        errorMessage = 'Required system dependencies (Ghostscript/qpdf) not found';
      } else if (error.message.includes('Invalid PDF')) {
        errorMessage = 'Invalid or corrupted PDF file';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password-protected PDF not supported';
      } else {
        errorMessage = `Compression failed: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
