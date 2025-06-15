import { forwardRef } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useImperativeHandle, useState } from "react";
import { debounce } from "@mui/material/utils";

const AppAutoComplete = forwardRef((props: any, ref) => {
  const [options, setOptions] = useState([]);

  useImperativeHandle(ref, () => ({
    setOptions: setOptions,
  }));

  const debouncedFetchOptions = debounce(props?.fetchOptions, 500);

  return (
    <Autocomplete
      getOptionLabel={props?.getOptionLabel}
      getOptionKey={props?.getOptionKey}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      fullWidth
      multiple
      filterSelectedOptions
      value={props?.value}
      inputValue={props?.inputValue}
      isOptionEqualToValue={(option, value) => option.email === value.email}
      // placeholder={props?.placeholder as any}
      onInputChange={(event, newInputValue) => {
        props?.setInputValue(newInputValue);
        debouncedFetchOptions(newInputValue); // Debounce fetchOptions function call
      }}
      renderOption={props?.renderOption}
      onChange={(event, newValue) => {
        props?.setValue(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...(params as any)}
          size={props.size ?? "medium"}
          label={props?.label as string}
          fullWidth
          placeholder={props.placeholder ?? ""}
        />
      )}
    />
  );
});

export default AppAutoComplete;
