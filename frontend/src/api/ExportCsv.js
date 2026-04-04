/**
 * exportCsv(data, filename)
 * Converts an array of objects to a CSV and triggers a browser download.
 *
 * @param {Array<Object>} data     - Array of row objects
 * @param {string}        filename - File name without .csv extension
 */
export const exportCsv = (data, filename = "export") => {
    if (!data || data.length === 0) {
      console.warn("exportCsv: no data to export");
      return;
    }
  
    const headers = Object.keys(data[0]);
  
    const formatCell = (val) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
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