# IPFS Setup Guide for BNW Token

This guide explains how to set up and use IPFS for storing your BNW Token's logo and metadata.

## Prerequisites

1. Node.js (v16 or later)
2. Yarn package manager
3. Pinata account (for IPFS pinning service)

## Setting Up Pinata

1. Create a Pinata account:
   - Go to [https://app.pinata.cloud/](https://app.pinata.cloud/)
   - Sign up for a new account if you don't have one

2. Get your API Keys:
   - Log in to your Pinata account
   - Go to `Developer > API Keys`
   - Click "New Key"
   - Enable the following permissions:
     - pinFileToIPFS
     - pinJSONToIPFS
   - Name your key (e.g., "BNW Token")
   - Copy both the API Key and API Secret

## Environment Setup

1. Create a `.env` file in your project root:
```bash
touch .env
```

2. Add your Pinata API keys to the `.env` file:
```
PINATA_API_KEY=your_api_key_here
PINATA_API_SECRET=your_api_secret_here
```

## Uploading Assets to IPFS

### 1. Upload Logo

```bash
# Make sure your logo is in the assets directory
yarn ipfs:upload-image assets/bnw-logo.png
```

After successful upload, you'll receive:
- IPFS Hash
- IPFS URL
- Gateway URL

### 2. Update Metadata

Edit `metadata/token-metadata.json`:
- Replace `QmYourImageHash` with the actual IPFS hash from step 1
- Update other metadata fields as needed

### 3. Upload Metadata

```bash
yarn ipfs:upload-metadata
```

This will:
- Upload the metadata JSON to IPFS
- Return the metadata IPFS hash
- Update the deployment script with the new tokenURI

### 4. Deploy All at Once

To upload both logo and metadata in one command:
```bash
yarn ipfs:deploy-all
```

## Verifying Your Upload

1. Check your logo:
   - Visit `https://gateway.pinata.cloud/ipfs/<your_logo_hash>`
   - The image should load correctly

2. Check your metadata:
   - Visit `https://gateway.pinata.cloud/ipfs/<your_metadata_hash>`
   - You should see your JSON metadata with the correct image IPFS link

## Troubleshooting

### Common Issues

1. **API Key Error**:
   ```
   Error: Pinata API keys not found
   ```
   - Solution: Check your `.env` file has the correct API keys

2. **File Not Found**:
   ```
   Error: Image file not found
   ```
   - Solution: Ensure your logo is in the correct directory

3. **Authentication Failed**:
   ```
   Error: Failed to authenticate with Pinata
   ```
   - Solution: Verify your API keys are valid and have the correct permissions

### Getting Help

If you encounter issues:
1. Check Pinata's status: [https://status.pinata.cloud/](https://status.pinata.cloud/)
2. Review Pinata's documentation: [https://docs.pinata.cloud/](https://docs.pinata.cloud/)
3. Open an issue in the BNW Token repository

## Best Practices

1. **Backup Your Files**:
   - Keep local copies of all uploaded files
   - Store your IPFS hashes securely

2. **Version Control**:
   - Document IPFS hashes in your deployment logs
   - Keep track of metadata versions

3. **Testing**:
   - Always verify uploads through a gateway before deployment
   - Test metadata JSON format and links

## Scripts Reference

Your project includes several helpful scripts:

- `yarn ipfs:upload-image`: Upload a single image to IPFS
- `yarn ipfs:upload-metadata`: Upload metadata JSON to IPFS
- `yarn ipfs:deploy-all`: Upload both image and metadata
- `yarn deploy:with-metadata`: Deploy contract with updated metadata

## Security Considerations

1. **API Keys**:
   - Never commit `.env` file to version control
   - Rotate API keys periodically
   - Use minimal permissions for API keys

2. **File Access**:
   - Verify file permissions before upload
   - Use content addressing (IPFS hashes) for verification

3. **Metadata**:
   - Validate JSON format before upload
   - Use HTTPS for all external links
   - Keep sensitive information off-chain 