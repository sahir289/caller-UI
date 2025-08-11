import formidable from "formidable";
import fs from "fs";

// Disable Next.js body parser for file uploads
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Error parsing file" });

      // Save file path and company type to DB here
      console.log("Company Type:", fields.companyType);
      console.log("File Uploaded:", files.file);

      return res.status(200).json({ success: true });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
