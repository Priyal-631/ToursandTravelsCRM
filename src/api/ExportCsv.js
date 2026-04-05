/**
 * src/api/ExportCsv.js
 *
 * exportCsv(data, filename)
 * Converts an array of objects to a CSV and triggers a browser download.
 *
 * Fix: date values (ISO strings like "2026-03-15") are formatted as
 * "dd/mm/yyyy" plain text so spreadsheet apps show them correctly
 * instead of rendering #### due to column-width issues with date serials.
 *
 * @param {Array<Object>} data     - Array of row objects
 * @param {string}        filename - File name without .csv extension
 */

/**
 * Detects an ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm...) and
 * converts it to dd/mm/yyyy so Excel/Sheets display it as readable text.
 */
function formatDateCell(val) {
  if (typeof val !== "string") return null;
  // Match "YYYY-MM-DD" with optional time component
  const match = val.match(/^(\d{4})-(\d{2})-(\d{2})(T.*)?$/);
  if (!match) return null;
  const [, yyyy, mm, dd] = match;
  return `${dd}/${mm}/${yyyy}`;
}

export const exportCsv = (data, filename = "export") => {
  if (!data || data.length === 0) {
    console.warn("exportCsv: no data to export");
    return;
  }

  const headers = Object.keys(data[0]);

  const formatCell = (val) => {
    if (val === null || val === undefined) return "";

    // Try date conversion first
    const asDate = formatDateCell(String(val));
    if (asDate) return asDate;

    const str = String(val);
    // Wrap in quotes if the value contains commas, newlines, or quotes
    return str.includes(",") || str.includes("\n") || str.includes('"')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const rows = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => formatCell(row[h])).join(",")),
  ];

  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href  = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};