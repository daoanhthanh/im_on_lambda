import { resize, downloadImage, toS3 } from "./services.js";
// doc for this: https://www.bytescale.com/blog/aws-lambda-image-resize/

export const handler = async (event, context) => {
	try {
		const { url, width, height, fileName } = event;
		const imagePath = await downloadImage(url, fileName);
		return await resize(imagePath, width, height).then(async (resizedImage) => {
			await toS3(resizedImage);
		});
	} catch (err) {
		console.error(err);
		console.error("Additional info:", { event, context });

		return err;
	}
};

handler({
	url: "https://images.unsplash.com/photo-1571053748382-141b7de59b88?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	width: 500,
	fileName: "test",
});
