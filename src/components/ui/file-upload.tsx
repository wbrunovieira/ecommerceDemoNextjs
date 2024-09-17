import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconUpload } from '@tabler/icons-react';

interface FileUploadProps {
    onChange?: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (acceptedFiles: File[]) => {
        onChange && onChange(acceptedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: {
            'image/*': [],
        },
        onDrop: handleFileChange,
        noClick: true,
    });

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            {...getRootProps()}
            className="cursor-pointer w-full max-w-xs mb-2 hover:scale-105 transition duration-300 ease-in-out"
            onClick={handleClick}
        >
            <input {...getInputProps()} ref={fileInputRef} className="hidden" />
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary p-2 rounded-lg">
                <div className="flex flex-col items-center">
                    <IconUpload className="h-4 w-8 text-primary " />
                    {isDragActive ? (
                        <p className="text-primary text-[.4rem]">
                            Solte a imagem aqui...
                        </p>
                    ) : (
                        <p className="text-primary text-[.4rem] mt-2">
                            Arraste ou clique para selecionar uma imagem
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
