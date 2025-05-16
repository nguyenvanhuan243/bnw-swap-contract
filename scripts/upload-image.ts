import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pinataSDK from '@pinata/sdk';

dotenv.config();

async function uploadImageToIPFS() {
    // Check if Pinata API keys are set
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_API_SECRET) {
        throw new Error('Please create a .env file with your Pinata API keys:\nPINATA_API_KEY=your_key\nPINATA_API_SECRET=your_secret');
    }

    // Initialize Pinata client
    const pinata = new pinataSDK(
        process.env.PINATA_API_KEY,
        process.env.PINATA_API_SECRET
    );

    try {
        // Test Pinata authentication
        await pinata.testAuthentication();
        console.log('✅ Successfully authenticated with Pinata');

        // Get image path from command line argument
        const imagePath = process.argv[2];
        if (!imagePath) {
            throw new Error('Please provide the image path as an argument:\nnpx ts-node scripts/upload-image.ts path/to/your/image.png');
        }

        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image file not found at: ${imagePath}`);
        }

        // Upload image
        console.log('📤 Uploading image...');
        const imageStream = fs.createReadStream(imagePath);
        const result = await pinata.pinFileToIPFS(imageStream, {
            pinataMetadata: {
                name: path.basename(imagePath)
            }
        });

        console.log('\n✨ Image uploaded successfully!');
        console.log('📋 IPFS Hash:', result.IpfsHash);
        console.log('🔗 IPFS URL:', `ipfs://${result.IpfsHash}`);
        console.log('🌐 Gateway URL:', `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);

    } catch (error: any) {
        console.error('❌ Error:', error.message || 'Unknown error occurred');
        process.exit(1);
    }
}

uploadImageToIPFS().catch(console.error); 