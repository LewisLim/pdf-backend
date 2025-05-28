const express = require("express");
const { chromium } = require("playwright");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Basic route to test server
app.get("/", (req, res) => {
  res.json({ message: "PDF Generator API is running!" });
});

// PDF generation route
app.get("/generate-pdf", async (req, res) => {
  try {
    console.log("Starting PDF generation...");

    // Get URL from query parameter (e.g., /generate-pdf?url=https://google.com)
    const url = req.query.url || "https://example.com";

    // Launch browser
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // needed for hosting
    });

    // Create new page
    const page = await browser.newPage();
    console.log(`Loading page: ${url}`);

    // Navigate to the URL
    await page.goto(url, { waitUntil: "networkidle" });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    });

    // Close browser
    await browser.close();
    console.log("PDF generated successfully!");

    // Send PDF back to client
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=generated.pdf",
      "Content-Length": pdf.length,
    });

    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res
      .status(500)
      .json({ error: "Failed to generate PDF", details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    `📄 Test PDF generation: http://localhost:${PORT}/generate-pdf?url=https://google.com`
  );
});
