import { Select, Stack, OutlinedInput, IconButton, Typography, MenuItem, FormControl, InputLabel, TextField, InputAdornment } from '@mui/material'
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
  }, [])

  //Select Currency
  const handleFromCurrencyChange = (event: SelectChangeEvent) => {
    setFromCurrency(event.target.value as string);
  }

  const handleToCurrencyChange = (event: SelectChangeEvent) => {
    setToCurrency(event.target.value as string);
  }

  //Change Values
  const handleChangeFromCurrencyValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (fromCurrencyValue.toString().length <= 10) {
      setFromCurrencyValue(+e.target.value);
    }
    convertCurrencies();
  }

  const handleChangeToCurrencyValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (toCurrencyValue.toString().length <= 10) {
      setToCurrencyValue(+e.target.value);
    }
    convertCurrencies();
  }

  //Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  const convertCurrencies = async () => {
    const data = await fetchConversionRates(fromCurrency, toCurrency);
    setConversionRate(data.conversion_rate);
  }

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
                  type='number'
                  inputMode='numeric'
                  inputProps={{ maxLength: 10 }}
                  disabled={!Boolean(toCurrency) || !Boolean(fromCurrency)}
                  onChange={handleChangeFromCurrencyValue}
                  value={toCurrencyValue / conversionRate}
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
                  type='number'
                  inputMode='numeric'
                  disabled={!Boolean(toCurrency) || !Boolean(fromCurrency)}
                  onChange={handleChangeToCurrencyValue}
                  value={fromCurrencyValue * conversionRate}
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
