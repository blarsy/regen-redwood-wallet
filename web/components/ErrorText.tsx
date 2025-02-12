import { Typography } from "@mui/material"
import { ReactNode } from "react"

const ErrorText = (p : { children: ReactNode}) => <Typography variant="body1" color="red">{p.children}</Typography>


export default ErrorText