import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
app.use(cors());

// Proxy route
app.use(
  "/proxy/hostelbite",
  createProxyMiddleware({
    target: process.env.HEYBOSS_URL,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/proxy/hostelbite": "",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${process.env.HEYBOSS_URL}${req.url}`);
    },
  })
);

app.listen(process.env.PORT, () => {
  console.log(`✅ Proxy server running on port ${process.env.PORT}`);
});
