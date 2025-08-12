// const rawData = [
//   {
//     datetime: "11/8/2025, 12:09:23 AM",
//     credit: 4700,
//     debit: 0,
//     closing: 4700,
//     description: "Withdraw ID: ANA02888954, From PNL: 4700, From BALANCE: 0",
//     fromTo: "annrd7 → admin",
//   },
//   {
//     datetime: "11/8/2025, 12:05:43 AM",
//     credit: 607,
//     debit: 0,
//     closing: 5307,
//     description: "Withdraw ID: ANA02888939, From PNL: 0, From BALANCE: 607",
//     fromTo: "ansgr247 → admin",
//   },
//   {
//     datetime: "11/8/2025, 12:04:15 AM",
//     credit: 0,
//     debit: 2000,
//     closing: 3307,
//     description: "Deposit ID: 09046785, To PNL: 2000, To BALANCE: 0",
//     fromTo: "admin → smitun247",
//   },
//   {
//     datetime: "10/8/2025, 11:59:55 PM",
//     credit: 10000,
//     debit: 0,
//     closing: 13307,
//     description: "Withdraw ID: ANA02888919, From PNL: 9300, From BALANCE: 700",
//     fromTo: "anvnk5247 → admin",
//   },
// ];

// export function createPayload(data, currentUser) {
//   return data
//     .filter((entry) => {
//       // If currentUser is admin, filter out admin transactions where admin is payer (withdrawal)
//       if (currentUser === "admin") {
//         const [from, to] = entry.fromTo.split(" → ").map((s) => s.trim());
//         // Skip if from is admin, we want only user side data
//         if (from.toLowerCase() === "admin") return false;
//       }
//       return true;
//     })
//     .map((entry) => {
//       const [from, to] = entry.fromTo.split(" → ").map((s) => s.trim());

//       const isWithdrawal = from.toLowerCase() === "admin";
//       const isDeposit = to.toLowerCase() === "admin";

//       return {
//         datetime: entry.datetime,
//         amount: isWithdrawal ? entry.debit || 0 : entry.credit || 0,
//         type: isWithdrawal ? "withdrawal" : isDeposit ? "deposit" : "unknown",
//         description: entry.description,
//         from,
//         to,
//       };
//     });
// }

// export const readExcelOrCsv = (file) => {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const data = new Uint8Array(event.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//       resolve(jsonData);
//     };
//     reader.readAsArrayBuffer(file);
//   });
// };

// export const readPdf = async (file) => {
//   const pdfData = new Uint8Array(await file.arrayBuffer());
//   const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
//   let textContent = "";

//   for (let i = 1; i <= pdfDoc.numPages; i++) {
//     const page = await pdfDoc.getPage(i);
//     const text = await page.getTextContent();
//     textContent += text.items.map((item) => item.str).join(" ") + "\n";
//   }

//   // You will need to split & format into table-like structure
//   // Example: Convert raw text to array of arrays
//   const rows = textContent
//     .split("\n")
//     .map((line) => line.trim().split(/\s{2,}/)); // Split by 2+ spaces
//   return rows;
// };

// export const createPayload = (data, currentUser) => {
//   // Skip header row
//   const rows = data.slice(1);

//   return rows
//     .filter((row) => row.length >= 6)
//     .map((row) => {
//       const datetime = row[0];
//       const credit = row[1] !== "-" ? parseFloat(row[1]) : 0;
//       const debit = row[2] !== "-" ? parseFloat(row[2]) : 0;
//       const closing = row[3];
//       const description = row[4];
//       const [from, to] = row[5].split(" → ").map((s) => s.trim());

//       const type =
//         from.toLowerCase() === "admin"
//           ? "withdrawal"
//           : to.toLowerCase() === "admin"
//           ? "deposit"
//           : "unknown";

//       return { datetime, amount: credit || debit, type, description, from, to };
//     });
// };
