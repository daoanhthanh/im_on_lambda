import { resize, downloadImage, toS3 } from "./services.js";
// doc for this: https://www.bytescale.com/blog/aws-lambda-image-resize/

export const handler = async (event, context) => {
	try {
		const { url, width, height, fileName } = event;
		const downloadedImage = await downloadImage(url, fileName);
		await resize(downloadedImage, width, height);
		const result = await toS3(downloadedImage);
		return result;
	} catch (err) {
		console.error(err);
		console.error("Additional info:", { event, context });
		return err;
	}
};
