import axios from 'axios';
import cron from 'node-cron';

const API_URL = 'https://installment-managing-app.onrender.com';

export async function setupCronJob() {
  console.log('job start');

  cron.schedule('0 * * * *', async () => {
    console.log('job run');
    try {
      await axios.get(`${API_URL}/profile/demo`);
    } catch (error) {
      console.error('API call error:', error);
    }
  });
}