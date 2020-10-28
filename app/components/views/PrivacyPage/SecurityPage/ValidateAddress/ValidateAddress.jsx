import { useState } from "react";
import ValidateAddressForm from "./ValidateAddressForm";
import { useValidateAddress } from "./hooks";

const ValidateAddress = () => {
  const { onValidateAddress, validateAddressSuccess } = useValidateAddress();
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);

  const onChangeAddress = async (address) => {
    setAddress(address);
    if (address === "") {
      return;
    }
    try {
      const resp = await onValidateAddress(address);
      setError(!resp.getIsValid() ? "Please enter a valid address" : null);
    } catch (e) {
      setError("Error: Address validation failed, please try again");
    }
  };

  return (
    <ValidateAddressForm
      {...{
        address,
        error,
        validateAddressSuccess,
        onChangeAddress
      }}
    />
  );
};

export default ValidateAddress;
