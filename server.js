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

    const action = req.query.action || "download";

    // Launch browser
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // needed for hosting
    });

    // Create new page
    const page = await browser.newPage();

    // Set viewport size (like browser window size)
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log(`Loading page: ${url}`);

    // Navigate to the URL
    await page.goto(url, { waitUntil: "networkidle" });

    await page.addStyleTag({
      content: `
    header, footer, nav, .back-button {
      display: none !important;
    }
    
    body {
      margin-top: -120px !important;
      padding: 0;
    }
      `,
    });

    // Wait for chart animations to complete and hidden items to disappear and move the main content up 
    await page.waitForTimeout(2000);

    // Debug with screenshot, or change headless to false at above
    // await page.screenshot({ path: "debug-screenshot.png", fullPage: true });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      scale: 0.54, // zoom out as needed to fit content into the pdf
      margin: {
        top: "0.5cm",
        right: "0.5cm",
        bottom: "0.5cm",
        left: "0.5cm",
      },
      preferCSSPageSize: false,
    });

    // Close browser
    await browser.close();
    console.log("PDF generated successfully!");

    // Send PDF back to client
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition":
        action === "download"
          ? "attachment; filename=generated.pdf"
          : "inline; filename=generated.pdf",
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
