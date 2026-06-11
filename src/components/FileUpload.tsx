'use client';
import { useState } from 'react';
import Image from 'next/image';

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreview(fileReader.result as string);
                setError(null);
            }
            fileReader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        try{
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if(!response.ok){
                const data = await response.json();
                setError(data.error);
                setUploading(false);
                return;
            }
            const data = await response.json();
            setUrl(data.url);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'Something went wrong');
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <input className="border border-gray-300 rounded px-3 py-2" type="file" onChange={handleFileChange} />
            {preview && <Image src={preview} alt="Preview" width={200} height={200} />}
            {error && <p className="text-red-500">{error}</p>}
            {url && <p className="text-blue-500">{url}</p>}
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" onClick={handleUpload} disabled={uploading || !file}>{uploading ? 'Uploading...' : 'Upload'}</button>
        </div>
    );

}