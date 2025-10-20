import express from 'express';
import connectDB from './configs/db.js';

const app = new express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!123');
});

connectDB().then(() => {
        // '0.0.0.0' ကို explicitly bind လုပ်ပါ
      app.listen(PORT, '0.0.0.0', () => {
          console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
          console.log(`✅ Accessible via http://localhost:${PORT}`);
      }); 
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1); // Exit process with failure
});