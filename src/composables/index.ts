const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const generateTrackingUrl = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `tef-${result}-${Date.now().toString().slice(-4)}`;
};

export const downloadCSV = (reservations: any) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date()
    .toLocaleTimeString("en-US", {
      timeZone: "Asia/Manila",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/:/g, "-");
  const filename = `tefs-reservations-${currentDate}-${currentTime}.csv`;

  const sortedReservations = [...reservations].sort((a: any, b: any) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const rows = sortedReservations.map((r: any) => ({
    Created: new Date(r.createdAt).toLocaleString("en-PH"), // Localized for PH
    URL: `https://tefs-photobooth.vercel.app/reservation/${r.url}`,
    Name: r.name,
    Email: r.email,
    Contact: r.contact_number,
    Package: r.package?.name || "N/A",
    Reservation_Date: r.event_date,
    Reservation_Time: r.event_time,
    Status: r.progress,
    Paid: r.payment ? "Yes" : "No",
    Address: r.address,
    Note: r.notes || "",
  }));

  if (rows.length === 0) return;

  const headerKeys = Object.keys(rows[0]);
  const csvContent = [
    headerKeys.join(","),
    ...rows.map((row: any) =>
      headerKeys
        .map((key) => `"${String(row[key]).replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
