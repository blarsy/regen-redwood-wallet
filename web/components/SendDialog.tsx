import { Coin } from "@keplr-wallet/types"
import { Alert, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material"
import { ErrorMessage, Formik } from "formik"
import * as yup from 'yup'
import ErrorText from "./ErrorText"
import { sendRegen } from "@/lib/wallet-client"
import { useState } from "react"

const SendDialog = (p : { coin?: Coin, onClose: (success?: { address: string, amount: number }) => void }) => {
    const [sendStatus, setSendStatus] = useState({ sending: false, error: undefined as Error | undefined})
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
                    setSendStatus({ sending: true, error: undefined })
                    await sendRegen(values.address, Number(values.amount))
                    setSendStatus({ sending: false, error: undefined })
                    p.onClose({ address: values.address, amount: Number(values.amount) })
                } catch(e) {
                    setSendStatus({ sending: false, error: (e as Error) })
                }
            }} initialValues={{ amount: '', address: '' }}>
                {(f) => {
                    return <Stack sx={{ gap: '1rem', paddingTop: '1rem' }}>
                        <TextField id="address" name="address" label="Destination address" variant="outlined" onChange={f.handleChange} onBlur={f.handleBlur}/>
                        <ErrorMessage component={ErrorText} name="address" />
                        <Stack>
                            <Typography variant="body1">{`Max : ${p.coin?.amount}`}</Typography>
                            <TextField id="amount" name="amount" label="Amount to send" variant="outlined" onChange={f.handleChange} onBlur={f.handleBlur}/>
                        </Stack>
                        <ErrorMessage component={ErrorText} name="amount" />
                        { sendStatus.error && <Alert severity="error" onClose={() => setSendStatus({ sending: false, error: undefined})}>{sendStatus.error.message}</Alert> }
                        <Stack direction="row" justifyContent="space-between">
                            <Button variant="contained" color="secondary" type="submit" onClick={() => p.onClose()}>Cancel</Button>
                            <Button loading={ sendStatus.sending } variant="contained" type="submit" onClick={() => f.handleSubmit()}>Send</Button>
                        </Stack>
                    </Stack>
                }}
            </Formik>
        </DialogContent>
    </Dialog>
}

export default SendDialog