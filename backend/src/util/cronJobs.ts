import axios from 'axios';
import cron from 'node-cron';

const API_URL = 'https://installment-managing-app.onrender.com/api';

export async function setupCronJob() {
  console.log('job start');

  cron.schedule('0 * * * *', async () => {
    console.log('job run');

    try {
      const response = await axios.get(`${API_URL}/auth/profile`);
      console.log('API response:', response.data);
    } catch (error) {
      console.error('API call error:', error);
    }
  });
}