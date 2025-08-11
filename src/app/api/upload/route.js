import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import pdfParse from "pdf-parse";
import csv from "csvtojson";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const fileName = file.name;
    const fileExt = path.extname(fileName).toLowerCase();
    let parsedData;

    console.log(`Processing ${fileExt} file: ${fileName}`);

    switch (fileExt) {
      case ".pdf":
        parsedData = await pdfParse(Buffer.from(fileBuffer));
        parsedData = {
          text: parsedData.text,
          metadata: parsedData.metadata,
          numPages: parsedData.numpages,
        };
        break;

      case ".csv":
        parsedData = await csv().fromString(Buffer.from(fileBuffer).toString());
        break;

      case ".xlsx":
      case ".xls":
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported file format" },
          { status: 400 }
        );
    }

    console.log("Parsed data:", parsedData);

    return NextResponse.json({
      success: true,
      fileName,
      fileType: fileExt,
      size: file.size,
      data: parsedData,
    });
  } catch (err) {
    console.error("Processing error:", err);
    return NextResponse.json(
      {
        error: err.message.includes("maxFileSize")
          ? "File size exceeds limit"
          : "File processing failed",
      },
      { status: 500 }
    );
  }
}
