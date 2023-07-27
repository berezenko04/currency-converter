import axios from "axios";

const API_KEY = 'ba7e729f5d0fa6d37c962aa9';
const DEFAULT_URL = 'https://v6.exchangerate-api.com/v6';

// export type TCurrencies = {
//     data: TCurrency[],
//     meta: {
//         last_updated_at: string
//     }
// }


export const fetchAllCurrencies = async () => {
    const { data } = await axios.get(`${DEFAULT_URL}/${API_KEY}/latest/USD`);
    return data;
}

export const fetchConversionRates = async (from: string, to: string) => {
    const { data } = await axios.get(`${DEFAULT_URL}/${API_KEY}/pair/${from}/${to}`);
    return data;
} 