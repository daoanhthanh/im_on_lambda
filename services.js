import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";
import { execFile } from "child_process";
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
	return await fetch(url)
		.then((response) => {
			return response.arrayBuffer();
		})
		.then(async (arrayBuffer) => {
			const fileType = await fileTypeFromBuffer(arrayBuffer);
			const outputFilePath = path.resolve(`/tmp/${name}.${fileType.ext}`);
			fs.writeFileSync(outputFilePath, Buffer.from(arrayBuffer), (err) => {
				if (err) {
					console.error(err);
				} else {
					console.log("Image downloaded successfully");
				}
			});
			return outputFilePath;
		});
};

/**
 * Resize the image to the specification, overwrite the original image
 * @param {String} imagePath: relative path of the image, usually the output of `downloadImage`
 * @param {number} width width of the image, mandatory
 * @param {number} height height of the image, optional
 * @returns {String} path of the image which is resized and overwritten, with extension
 */
const resize = async (imagePath, width, height = undefined) => {
	fs.access(imagePath, fs.F_OK, (err) => {
		if (err) {
			console.error(err);
		}

		console.log("Image exists", imagePath);
	});
	await new Promise((resolve, reject) => {
		const spec = height ? `${width}x${height}` : `${width}`;
		execFile(
			"./imagemagick/bin/magick",
			[imagePath, "-resize", spec, imagePath],
			(error, stdout, stderr) => {
				if (stderr) {
					console.log(`stderr: ${stderr}`);
					return;
				}
				if (error !== null) {
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
	// const key = `${fileName}.${contentType.ext}`;
	const params = {
		Bucket: s3Bucket,
		Key: imageName,
		Body: imageBuffer,
	};

	const command = new PutObjectCommand(params);

	return await client.send(command);
};

export { downloadImage, toS3, resize };
