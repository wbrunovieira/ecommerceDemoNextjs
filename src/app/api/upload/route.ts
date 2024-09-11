import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { IncomingForm, Fields, Files, File as FormidableFile } from 'formidable';


export const config = {
  api: {
    bodyParser: false,
  },
};


const saveFile = async (file: FormidableFile): Promise<string> => {
    const data = fs.readFileSync(file.filepath); 
    const fileName = `${Date.now()}_${file.originalFilename}`; 
    const uploadDir = path.join(process.cwd(), 'public/uploads');

 
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

 
  const filePath = path.join(uploadDir, fileName);
  
  fs.writeFileSync(filePath, data); 
  fs.unlinkSync(file.filepath); 

  return `/uploads/${fileName}`; 
};


export async function POST(req: Request) {
  try {
    const form = new IncomingForm();
    
    // Parsing do formulário com o arquivo
    const { files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
        form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });
    const file = files.file as FormidableFile;
   
    const fileUrl = await saveFile(file);

    
    return NextResponse.json({ imageUrl: fileUrl });
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    return NextResponse.json({ message: 'Erro ao fazer upload do arquivo' }, { status: 500 });
  }
}
