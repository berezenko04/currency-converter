import { Select, Stack, OutlinedInput, IconButton, Typography, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material'
import { SyncAlt } from '@mui/icons-material'
import { useState, useEffect, ChangeEvent } from 'react'
import { SelectChangeEvent } from '@mui/material/Select';

//styles
import styles from './App.module.scss'

//service
import { fetchAllCurrencies, fetchConversionRates } from './services/CurrencyService'


const App: React.FC = () => {
  const [currenciesList, setCurrenciesList] = useState<string[]>();
  const [fromCurrency, setFromCurrency] = useState('');
  const [conversionRate, setConversionRate] = useState(0);
  const [fromCurrencyValue, setFromCurrencyValue] = useState(0);
  const [toCurrency, setToCurrency] = useState('');
  const [toCurrencyValue, setToCurrencyValue] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await fetchAllCurrencies();
      setCurrenciesList(Object.keys(response.conversion_rates));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (fromCurrency && toCurrency) {
        const data = await fetchConversionRates(fromCurrency, toCurrency);
        setConversionRate(data.conversion_rate);
        setToCurrencyValue(fromCurrencyValue * data.conversion_rate);
      }
    })();
  }, [fromCurrency, toCurrency, fromCurrencyValue]);

  // Select Currency
  const handleFromCurrencyChange = (event: SelectChangeEvent<string>) => {
    setFromCurrency(event.target.value as string);
  };

  const handleToCurrencyChange = (event: SelectChangeEvent<string>) => {
    setToCurrency(event.target.value as string);
  };

  // Change Values
  const handleChangeFromCurrencyValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setFromCurrencyValue(value);
    setToCurrencyValue(value * conversionRate);
  };

  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className={styles.app}>
      <div className="container">
        <Stack justifyContent='center' height='100vh'>
          <Stack direction='column' spacing='64px' alignItems='center'>
            <Typography variant='h2' textTransform='uppercase' fontWeight='500'>
              Currency Converter
            </Typography>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              alignItems={'center'}
              spacing='24px'
            >
              <Stack direction='column' spacing='24px'>
                <FormControl sx={{ width: '400px' }}>
                  <InputLabel id="from-label">From</InputLabel>
                  <Select
                    labelId="from-label"
                    id="from"
                    value={fromCurrency}
                    label="From"
                    onChange={handleFromCurrencyChange}
                  >
                    {currenciesList && currenciesList.map((currency, index) => (
                      <MenuItem key={index} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <OutlinedInput
                  endAdornment={<InputAdornment position="end">{fromCurrency}</InputAdornment>}
                  type="text"
                  inputMode="numeric"
                  disabled={!toCurrency || !fromCurrency}
                  onChange={handleChangeFromCurrencyValue}
                  defaultValue={fromCurrencyValue}
                />
              </Stack>
              <IconButton size='large' onClick={handleSwapCurrencies}>
                <SyncAlt />
              </IconButton>
              <Stack direction='column' gap='24px'>
                <FormControl sx={{ width: '400px' }}>
                  <InputLabel id="from-label">To</InputLabel>
                  <Select
                    labelId="to-label"
                    id="to"
                    value={toCurrency}
                    label="To"
                    onChange={handleToCurrencyChange}
                  >
                    {currenciesList && currenciesList.map((currency, index) => (
                      <MenuItem key={index} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <OutlinedInput
                  endAdornment={<InputAdornment position="end">{toCurrency}</InputAdornment>}
                  type="number"
                  inputMode="numeric"
                  disabled={!toCurrency || !fromCurrency}
                  value={toCurrencyValue.toFixed(2)}
                  readOnly
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </div>
  )
}

export default App
