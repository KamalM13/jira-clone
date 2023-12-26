"use client"
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DownloadButtonProps {
    data: any[]; // Replace 'any' with the actual type of your data
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ data }) => {
    const handleDownload = () => {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'lists.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Button className='absolute bottom-5' onClick={handleDownload}>
            Download JSON
        </Button>
    );
};

export default DownloadButton;