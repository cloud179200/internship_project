
import { useCallback, useState } from "react";
import { IRegisterParams, IRegisterValidation, ILocationParams, ICapitalParams } from "../../../models/auth";
import { validateRegister, validRegister } from "../utils";
import { Box, TextField, Alert, Button, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, InputLabel, Select, MenuItem } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { FormattedMessage } from "react-intl"

interface Props {
    onRegister(values: IRegisterParams): void;
    loading: boolean;
    errorMessage: string;
    locations: Array<ILocationParams>;
    capitals: Array<ICapitalParams>;
    getCapitals: (pid: number) => Promise<void>;
}
const RegisterForm = (props: Props) => {
    const { onRegister, loading, errorMessage, locations, capitals, getCapitals } = props;
    const [formValues, setFormValues] = useState<IRegisterParams>({ email: "", password: "", confirmPassword: "", name: "", gender: "male", region: "", state: "" })
    const [validate, setValidate] = useState<IRegisterValidation>()
    const submit = useCallback((e) => {
        e.preventDefault();
        const validate = validateRegister(formValues);
        setValidate(validate);

        if (!validRegister(validate)) {
            return;
        }
        onRegister(formValues)
    }, [formValues, onRegister])
    return (
        <Box component="form" width={1} maxWidth={"600px"} p={3} autoComplete="off" sx={{ display: "flex", flexDirection: "column", '& .MuiTextField-root': { width: '100%', pb: 2 }, '& .MuiFormControl-root': { pb: 2 }, "& .MuiAlert-root": { mb: 2 } }} noValidate onSubmit={submit}>
            <TextField
                required
                label={<FormattedMessage id={!!validate?.email ? validate.email : "email"} />}
                type="email"
                error={!!validate?.email}
                value={formValues.email}
                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
            />
            <TextField
                required
                label={<FormattedMessage id={!!validate?.name ? validate.name : "name"} />}
                type="text"
                error={!!validate?.name}
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            />
            <TextField
                required
                label={<FormattedMessage id={!!validate?.password ? validate.password : "password"} />}
                type="password"
                error={!!validate?.password}
                value={formValues.password}
                onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
            />  <TextField
                required
                label={<FormattedMessage id={!!validate?.confirmPassword ? validate.confirmPassword : "repeatPassword"} />}
                type="password"
                error={!!validate?.confirmPassword}
                value={formValues.confirmPassword}
                onChange={(e) => setFormValues({ ...formValues, confirmPassword: e.target.value })}
            />
            <FormControl fullWidth >
                <FormLabel><FormattedMessage id="gender" /></FormLabel>
                <RadioGroup
                    row
                    value={formValues.gender}
                    onChange={(e) => setFormValues({ ...formValues, gender: formValues.gender === "male" ? "female" : "male" })}
                >
                    <FormControlLabel value="male" checked={formValues.gender === "male"} control={<Radio />} label={<FormattedMessage id="male" />} />
                    <FormControlLabel value="female" control={<Radio />} label={<FormattedMessage id="female" />} />
                </RadioGroup>
            </FormControl>
            <FormControl fullWidth error={!!validate?.region}><InputLabel>{<FormattedMessage id={!!validate?.region ? validate.region : "region"} />}</InputLabel>
                <Select
                    value={formValues.region}
                    label={<FormattedMessage id={!!validate?.region ? validate.region : "region"} />}
                    onChange={async (e) => {
                        setFormValues({ ...formValues, region: e.target.value, state: "" })
                        await getCapitals(+e.target.value)
                    }}>
                    {locations.map(item => <MenuItem key={item.name} value={item.id}>{item.name}</MenuItem>)}
                </Select>
            </FormControl>
            {capitals.length > 0 && <FormControl fullWidth error={!!validate?.state}><InputLabel>{ <FormattedMessage id={!!validate?.state ? validate.state: "state"} />}</InputLabel>
                <Select
                    value={formValues.state}
                    label={ <FormattedMessage id={!!validate?.state ? validate.state :"state"} />}
                    onChange={(e) => {
                        setFormValues({ ...formValues, state: e.target.value })
                    }}>
                    {capitals.map(item => <MenuItem key={item.name} value={item.id}>{item.name}</MenuItem>)}
                </Select>
            </FormControl>}
            {errorMessage !== "" && <Alert severity="error"><FormattedMessage id={errorMessage}/></Alert>}
            <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                <LoadingButton variant="outlined" size="large" type="submit" loading={loading}><FormattedMessage id="register" /></LoadingButton>
                <Button variant="text" href="/login"><FormattedMessage id="alreadyhaveanaccount" /></Button>
            </Box>
        </Box>)
}
export default RegisterForm