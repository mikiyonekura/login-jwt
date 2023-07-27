const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const auth = require('./routes/auth');
const post = require('./routes/post');


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));


app.use(express.json());
app.use("/auth", auth)
app.use("/post", post)

app.get("/", (req, res) => {
    res.send("Helloo World");
});

app.listen(PORT, () => {
    console.log(`Server is runnnnning on port ${PORT}`);
});