import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";
import { exec } from "child_process";
import path from "path";

const s3Bucket = "lamda-func-output";

const client = new S3Client({
	region: "us-east-1",
	credentials: {
		accessKeyId: "AKIASZZ3QHILA5PIKPFL",
		secretAccessKey: "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",
	},
});

/**
 * Download image from url
 * @param {String} url URL of the image
 * @param {String} name name of the image, without extension
 * @returns {Promise<String>} path of the image, with extension
 */
const downloadImage = async (url, name) => {
	console.log("Downloading image", url);

	const response = await fetch(url);
	const bodyAsBuffer = await response.arrayBuffer();
	const fileType = await fileTypeFromBuffer(bodyAsBuffer);
	const outputFilePath = path.resolve(`/tmp/${name}.${fileType.ext}`);

	try {
		fs.writeFileSync(outputFilePath, Buffer.from(bodyAsBuffer));
		console.log("Image downloaded successfully");
	} catch (err) {
		console.error(err);
	}

	return outputFilePath;
};

/**
 * Resize the image to the specification, overwrite the original image
 * @param {String} imagePath: relative path of the image, usually the output of `downloadImage`
 * @param {number} width width of the image, mandatory
 * @param {number} height height of the image, optional
 */
const resize = async (imagePath, width, height = undefined) => {
	await new Promise((resolve, reject) => {
		const spec = height ? `${width}x${height}` : `${width}`;

		exec(
			`magick ${imagePath} -resize ${spec} ${imagePath}`,
			(error, stdout, stderr) => {
				if (stderr) {
					const lineErr = stderr.split("\n");
					lineErr.forEach((line) => console.error(line));
					return;
				}
				if (error !== null) {
					console.error(`exec error: ${error}`);
					reject(error);
				} else {
					console.log("Done!", stdout);
					resolve(console.log("Image resized successfully"));
				}
			}
		);
	});

	return imagePath;
};

/**
 * Upload image to AWS S3
 * @param {String} imagePath relative path of the image
 */
const toS3 = async (imagePath) => {
	console.log("Uploading to S3", imagePath);
	const imageName = imagePath.split("/").pop();
	const imageBuffer = fs.readFileSync(imagePath);
	const params = {
		Bucket: s3Bucket,
		Key: imageName,
		Body: imageBuffer,
	};

	const command = new PutObjectCommand(params);

	return await client.send(command);
};

export { downloadImage, toS3, resize };
