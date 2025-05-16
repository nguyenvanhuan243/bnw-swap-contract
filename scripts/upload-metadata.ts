import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pinataSDK from '@pinata/sdk';

dotenv.config();

async function uploadToIPFS() {
    // Check if Pinata API keys are set
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_API_SECRET) {
        throw new Error('Pinata API keys not found in .env file');
    }

    // Initialize Pinata client
    const pinata = new pinataSDK(
        process.env.PINATA_API_KEY,
        process.env.PINATA_API_SECRET
    );

    try {
        // Test Pinata authentication
        await pinata.testAuthentication();
        console.log('Successfully authenticated with Pinata');

        // Upload logo first
        console.log('Uploading logo...');
        const logoPath = path.join(__dirname, '../assets/bnw-logo.png');
        if (!fs.existsSync(logoPath)) {
            throw new Error('Logo file not found! Please place your logo at assets/bnw-logo.png');
        }

        const logoStream = fs.createReadStream(logoPath);
        const logoResult = await pinata.pinFileToIPFS(logoStream, {
            pinataMetadata: {
                name: 'BNW Token Logo'
            }
        });
        console.log('Logo uploaded to IPFS with hash:', logoResult.IpfsHash);

        // Update metadata with logo IPFS hash
        const metadataPath = path.join(__dirname, '../metadata/token-metadata.json');
        let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        metadata.image = `ipfs://${logoResult.IpfsHash}/bnw-logo.png`;

        // Upload updated metadata
        console.log('Uploading metadata...');
        const metadataResult = await pinata.pinJSONToIPFS(metadata, {
            pinataMetadata: {
                name: 'BNW Token Metadata'
            }
        });
        console.log('Metadata uploaded to IPFS with hash:', metadataResult.IpfsHash);

        // Save the final tokenURI for use in deployment
        const tokenURI = `ipfs://${metadataResult.IpfsHash}`;
        console.log('\nFinal tokenURI for deployment:', tokenURI);
        
        // Update deployment script with new tokenURI
        const deployScriptPath = path.join(__dirname, './deploy.ts');
        let deployScript = fs.readFileSync(deployScriptPath, 'utf8');
        deployScript = deployScript.replace(
            /const tokenURI = ".*";/,
            `const tokenURI = "${tokenURI}";`
        );
        fs.writeFileSync(deployScriptPath, deployScript);
        console.log('\nDeployment script updated with new tokenURI');

    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        process.exit(1);
    }
}

uploadToIPFS().catch(console.error); 