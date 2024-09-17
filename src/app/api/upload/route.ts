import { NextResponse } from 'next/server';

import path from 'path';
import { promises as fs } from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

const saveFile = async (file: File): Promise<string> => {
    const data = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, data);

    return `/uploads/${fileName}`;
};

const deleteOldFile = async (fileUrl: string) => {
    if (!fileUrl) return;

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(process.cwd(), 'public', fileUrl);

    if (!filePath.startsWith(uploadDir)) {
        console.error(
            'Tentativa de deletar um arquivo fora do diretório de uploads.'
        );
        return;
    }
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    } catch (error) {
        console.error('Erro ao deletar o arquivo antigo:', error);
    }
};

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const file = formData.get('file') as File;
        const oldFileUrl = formData.get('oldFileUrl') as string;

        if (!file) {
            return NextResponse.json(
                { message: 'Nenhum arquivo foi enviado' },
                { status: 400 }
            );
        }

        const fileUrl = await saveFile(file);
        await deleteOldFile(oldFileUrl);

        return NextResponse.json({ imageUrl: fileUrl });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
            { message: 'File upload failed' },
            { status: 500 }
        );
    }
}
