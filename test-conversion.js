const { fromPath } = require('pdf2pic');
const fs = require('fs');
const path = require('path');

async function testConversion() {
  try {
    console.log('Testing PDF to JPG conversion...');
    
    const convert = fromPath('./test.pdf', {
      density: 150,
      saveFilename: 'test-page',
      savePath: '/tmp',
      format: 'jpeg',
      width: 800,
      height: 600,
      quality: 90
    });
    
    console.log('Converting PDF...');
    const result = await convert(1, { responseType: 'image' });
    console.log('Conversion result:', result);
    
    // Check if the output file was created
    const outputPath = '/tmp/test-page.1.jpeg';
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log('Output file created successfully:', outputPath);
      console.log('File size:', stats.size, 'bytes');
    } else {
      console.log('Output file not found');
    }
    
  } catch (error) {
    console.error('Conversion failed:', error.message);
    console.error('Full error:', error);
  }
}

testConversion();
