import express from "express";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import postsRouter from "./routes/postsRouter.js";
import userRouter from "./routes/userRouter.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(express.json());
app.use("/backend/uploads", express.static("uploads"));

app.use(
  cors({
    origin: ["http://localhost:3000"], // your Next.js dev URL
    credentials: true, // allow cookies
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
