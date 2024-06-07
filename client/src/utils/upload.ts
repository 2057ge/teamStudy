import axios from 'axios';

async function uploadedFile(path: string, data: any) {
	var formData = new FormData();
	let key: keyof typeof data;
	for (key in data) {
		if (key === 'files') {
			for (let raw of data[key]) formData.append('files', raw);
		} else formData.append(key, data[key]);
	}
	return await axios.post(path, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
}
export { uploadedFile };
