const cloudinary = async(file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'user_avatar_upload');

    try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dj4v8frel/image/upload', {
            method: 'POST',
            body: formData,
        });
    
        const data = await res.json();
        console.log('Cloudinary response: ', data);

        if(data.error) {
            console.error('Cloudinary Error: ', data.error);
            return null;
        }
        
        if(data.secure_url) {
            return data.secure_url;
        } else {
            console.error('cloudinary上传失败');
            return null;
        }
    } catch (error) {
        console.error('上传失误： ', error);
        return null;
    }
}

export {cloudinary};