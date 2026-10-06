const exportService = {
  exportJSON(data, fileName = "data") {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `${fileName}.json`;

    a.click();

    URL.revokeObjectURL(url);
  },

  exportCSV(data, fileName = "report") {
    if (!data.length) return;

    const headers = Object.keys(data[0]);

    const csv = [
      headers.join(","),

      ...data.map((row) =>
        headers
          .map((header) => row[header])
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `${fileName}.csv`;

    a.click();

    URL.revokeObjectURL(url);
  },
};

export default exportService;