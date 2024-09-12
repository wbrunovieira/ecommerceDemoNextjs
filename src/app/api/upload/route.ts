import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

// Disable automatic body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

// Function to stream the Next.js Fetch Request body into Formidable
const parseForm = async (
    req: Request
): Promise<{ fields: any; files: any }> => {
    const form = new IncomingForm();

    return new Promise((resolve, reject) => {
        const formData = Readable.from(req.body as any); // Convert Fetch request body to Node.js readable stream

        form.parse(formData as any, (err, fields, files) => {
            if (err) {
                reject(err);
            } else {
                resolve({ fields, files });
            }
        });
    });
};

// Function to save the uploaded file
const saveFile = async (file: any): Promise<string> => {
    const data = fs.readFileSync(file.filepath);
    const fileName = `${Date.now()}_${file.originalFilename}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, data);
    fs.unlinkSync(file.filepath); // Remove temporary file

    return `/uploads/${fileName}`; // Return the URL of the saved file
};

// POST method for handling file uploads
export async function POST(req: Request) {
    try {
        // Parse the form data using Formidable
        const { files } = await parseForm(req);

        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file) {
            return NextResponse.json(
                { message: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Save the uploaded file
        const fileUrl = await saveFile(file);

        return NextResponse.json({ imageUrl: fileUrl });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
            { message: 'File upload failed' },
            { status: 500 }
        );
    }
}

// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';
// import {
//     IncomingForm,
//     Fields,
//     Files,
//     File as FormidableFile,
// } from 'formidable';
// import { IncomingMessage } from 'http';

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// const saveFile = async (file: FormidableFile): Promise<string> => {
//     const data = fs.readFileSync(file.filepath);
//     const fileName = `${Date.now()}_${file.originalFilename}`;
//     const uploadDir = path.join(process.cwd(), 'public/uploads');

//     if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const filePath = path.join(uploadDir, fileName);

//     fs.writeFileSync(filePath, data);
//     fs.unlinkSync(file.filepath);

//     return `/uploads/${fileName}`;
// };

// export async function POST(req: Request) {
//     try {
//         const form = new IncomingForm();

//         const incomingReq = req as unknown as IncomingMessage;

//         const { files } = await new Promise<{ fields: Fields; files: Files }>(
//             (resolve, reject) => {
//                 form.parse(
//                     incomingReq,
//                     (err: Error | null, fields: Fields, files: Files) => {
//                         if (err) reject(err);
//                         resolve({ fields, files });
//                     }
//                 );
//             }
//         );

//         const file =
//             files.file && !Array.isArray(files.file)
//                 ? (files.file as FormidableFile)
//                 : Array.isArray(files.file)
//                 ? (files.file[0] as FormidableFile)
//                 : undefined;

//         if (!file) {
//             return NextResponse.json(
//                 { message: 'Nenhum arquivo foi enviado' },
//                 { status: 400 }
//             );
//         }

//         const fileUrl = await saveFile(file);

//         return NextResponse.json({ imageUrl: fileUrl });
//     } catch (error) {
//         console.error('Erro ao fazer upload do arquivo:', error);
//         return NextResponse.json(
//             { message: 'Erro ao fazer upload do arquivo' },
//             { status: 500 }
//         );
//     }
// }
