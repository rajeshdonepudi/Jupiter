import AppAutoComplete from "@/components/ui-components/AppAutoComplete";
import { Button, Stack, TextField } from "@mui/material";
import { useRef, useState } from "react";
import AppRichTextEditor from "@/components/ui-components/AppRichTextEditor";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useFormik } from "formik";
import NewMailValidationScheme from "@/validation-schemes/Mail/NewMailValidationScheme";
import { selectAuth } from "@/store/Slices/authSlice";
import { useSelector } from "react-redux";
import AppConstants from "@/constants/constants";
import Grid from '@mui/material/Grid2';


const NewMail = (props: any) => {
  const [toInputState, setToInputState] = useState<string>("");
  const [ccInputState, setCCInputState] = useState<string>("");
  const [bccInputState, setBccInputState] = useState<string>("");
  const { accessToken } = useSelector(selectAuth);

  const inputRefTo = useRef<any>(null);
  const inputRefCc = useRef<any>(null);
  const inputRefBcc = useRef<any>(null);

  const formik = useFormik({
    initialValues: {
      toRecipients: [],
      ccRecipients: [],
      bccRecipients: [],
      subject: "",
      body: "",
    },
    validationSchema: NewMailValidationScheme,
    onSubmit: (values) => {
      props?.onMailComposed(values);
    },
  });

  const fetchOptions = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }UserLookup/users-lookup?searchTerm=${inputValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      const data = await response.json();
      debugger;
      inputRefTo?.current?.setOptions(data?.data);
      inputRefCc?.current?.setOptions(data?.data);
      inputRefBcc?.current?.setOptions(data?.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  return (
    <Stack sx={{ width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={AppConstants.layout.StandardSpacing}>
          <Grid size={{ xs: 6, md: 6 }}>
            <AppAutoComplete
              value={formik.values.toRecipients}
              setValue={(values: any) => {
                formik.setFieldValue("toRecipients", values);
              }}
              fetchOptions={fetchOptions}
              setInputValue={setToInputState}
              inputValue={toInputState}
              getOptionKey={(option: any) => option.id}
              getOptionLabel={(option: any) => option.email}
              label={"To"}
              ref={inputRefTo}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 6 }}>
            <AppAutoComplete
              value={formik.values.ccRecipients}
              setValue={(values: any) => {
                formik.setFieldValue("ccRecipients", values);
              }}
              fetchOptions={fetchOptions}
              setInputValue={setCCInputState}
              getOptionKey={(option: any) => option.id}
              getOptionLabel={(option: any) => option.email}
              inputValue={ccInputState}
              label={"Cc"}
              ref={inputRefCc}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 6 }}>
            <AppAutoComplete
              value={formik.values.bccRecipients}
              setValue={(values: any) => {
                formik.setFieldValue("bccRecipients", values);
              }}
              fetchOptions={fetchOptions}
              setInputValue={setBccInputState}
              inputValue={bccInputState}
              getOptionKey={(option: any) => option.id}
              getOptionLabel={(option: any) => option.email}
              label={"Bcc"}
              ref={inputRefBcc}
            />
          </Grid>
          <Grid  size={{ xs: 12, md: 12 }}>
            <TextField
              multiline
              fullWidth
              label="Subject"
              id="subject"
              value={formik.values.subject}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue("subject", event.target.value);
              }}
            />
          </Grid>
          <Grid  size={{ xs: 12, md: 12 }}>
            <AppRichTextEditor
              onEditorContentUpdate={(content: string) => {
                formik.setFieldValue("body", content);
              }}
              editable={true}
            />
          </Grid>
          <Grid size={12}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendOutlinedIcon />}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
};

export default NewMail;
