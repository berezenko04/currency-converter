import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#000000'
        }
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ }) => ({

                }),
            }
        }
    }
})