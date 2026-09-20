import axios from 'axios';

export async function uploadProfilePhoto(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) throw new Error('Konfigurasi Cloudinary belum lengkap.');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'profile-photos');
  const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
  return response.data.secure_url;
}
