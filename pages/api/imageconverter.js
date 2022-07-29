const puppeteer = require("puppeteer");

export default function handler(req, res) {
    const { url } = req.query
    let img = new Date() + '.png'
    puppeteer
  .launch({
    defaultViewport: {
      width: 1280,
      height: 2000,
    },
  })
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.goto(url ? url : "https://faiezwaseem.github.io/sticky-notes/");
    await page.screenshot({ path: img });
    await browser.close();
    res.status(200).json({
        status : 'succes',
        fallback : img
    }) 
  });

   
  }