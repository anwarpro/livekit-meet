import Cors from 'cors';
import { initMiddleware } from './InitMiddleware';

// Initialize the cors middleware
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
        origin: '*', // Allow all origins
    })
);

export default cors;
