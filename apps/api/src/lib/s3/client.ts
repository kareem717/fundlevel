import { S3Client } from "@aws-sdk/client-s3";

export const createS3Client = () => {
	//TODO: fix
	return new S3Client({
		region: "auto",
		endpoint: "https://.r2.cloudflarestorage.com",
		credentials: {
			accessKeyId: "env.R2_ACCESS_KEY_ID",
			secretAccessKey: "env.R2_SECRET_ACCESS_KEY",
		},
	});
};
