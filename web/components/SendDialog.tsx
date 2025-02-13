import { Coin } from "@keplr-wallet/types"
import { Alert, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material"
import { ErrorMessage, Formik } from "formik"
import * as yup from 'yup'
import ErrorText from "./ErrorText"
import { sendRegen } from "@/lib/wallet-client"
import { useState } from "react"

const SendDialog = (p : { coin?: Coin, onClose: (success?: { address: string, amount: number }) => void }) => {
    const [error, setError] = useState('')
    return <Dialog open={!!p.coin}>
        <DialogTitle>{`Send ${p.coin?.denom}`}</DialogTitle>
        <DialogContent>
            <Formik validationSchema={yup.object().shape({
                amount: yup.string().matches(
                    /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
                    "must be a positive number"
                  ).required(),
                address: yup.string().required()
            })}
            onSubmit={async values => {
                try {
                    await sendRegen(values.address, Number(values.amount))
                    p.onClose({ address: values.address, amount: Number(values.amount) })
                } catch(e) {
                    setError((e as Error).message)
                }
            }} initialValues={{ amount: '', address: '' }}>
                {(f) => {
                    return <Stack sx={{ gap: '1rem' }}>
                        <TextField id="address" name="address" label="Destination address" variant="outlined" onChange={f.handleChange} onBlur={f.handleBlur}/>
                        <ErrorMessage component={ErrorText} name="address" />
                        <Stack>
                            <Typography variant="body1">{`Max : ${p.coin?.amount}`}</Typography>
                            <TextField id="amount" name="amount" label="Amount to send" variant="outlined" onChange={f.handleChange} onBlur={f.handleBlur}/>
                        </Stack>
                        <ErrorMessage component={ErrorText} name="amount" />
                        { error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert> }
                        <Stack direction="row" justifyContent="space-between">
                            <Button variant="contained" color="secondary" type="submit" onClick={() => p.onClose()}>Cancel</Button>
                            <Button variant="contained" type="submit" onClick={() => f.handleSubmit()}>Send</Button>
                        </Stack>
                    </Stack>
                }}
            </Formik>
        </DialogContent>
    </Dialog>
}

export default SendDialog