
const isProduction = import.meta.env.MODE === 'production';


export const BASE_URL = isProduction
  ? 'https://your-production-domain.com' 
  : 'http://localhost:3613'; 