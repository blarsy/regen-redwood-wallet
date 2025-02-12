import { Coin } from "@keplr-wallet/types"
import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from "@mui/material"
import { ErrorMessage, Field, Formik } from "formik"
import * as yup from 'yup'
import ErrorText from "./ErrorText"

const SendDialog = (p : { coin?: Coin }) => {
    return <Dialog open={!!p.coin}>
        <DialogTitle>{`Send ${p.coin?.denom}`}</DialogTitle>
        <DialogContent>
            <Formik validationSchema={yup.object().shape({
                amount: yup.number().required(),
                address: yup.string().required()
            })}
            onSubmit={() => {

            }} initialValues={{ amount: 0, address: '' }}>
                {(f) => {
                    console.log(f)
                    return <Stack sx={{ gap: '1rem' }}>
                        <Field component={TextField} id="address" name="address" label="Destination address" variant="outlined" />
                        <ErrorMessage component={ErrorText} name="address" />
                        <Field component={TextField} id="amount" name="amount" label="Amount to send" variant="outlined" />
                        <ErrorMessage component={ErrorText} name="amount" />
                        <Button variant="contained" type="submit" onClick={() => f.handleSubmit()}>Send</Button>
                    </Stack>
                }}
            </Formik>
        </DialogContent>
    </Dialog>
}

export default SendDialog