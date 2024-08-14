import {
  Button, ModalHeader, ModalBody, ModalFooter, Input,
} from "@nextui-org/react";
import { useState } from "react";
import * as EmailValidator from "email-validator";
import Cookies from "js-cookie";
import MailIcon from "../Icons/Mailcon";
import LockIcon from "../Icons/LockIcon";
import AxiosWrapper from "../../utils/axiosWrapper";

export default function SignInComponent({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [wrongInfoError, setWrongInfoError] = useState(false);

  const getPasswordError = () => {
    if (emailError) return "Please Enter a valid email";
    if (wrongInfoError) return "Email or Password not correct";
    return "";
  };

  return (
    (
      <>

        <ModalHeader className="flex flex-col gap-1">Sign In</ModalHeader>
        <ModalBody>
          <Input
            value={signInData.email}
            onValueChange={(value) => {
              setSignInData({ ...signInData, email: value });
            }}
            endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
            label="Email"
            placeholder="Enter your email"
            variant="bordered"
            isInvalid={emailError}
            errorMessage={emailError && "Please Enter a valid email"}
            isDisabled={isLoading}
          />
          <Input
            value={signInData.password}
            onValueChange={(value) => {
              setSignInData({ ...signInData, password: value });
            }}
            endContent={
              <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
            label="Password"
            placeholder="Enter your password"
            type="password"
            variant="bordered"
            isInvalid={passwordError || wrongInfoError}
            errorMessage={getPasswordError()}
            isDisabled={isLoading}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={isLoading}
            color="danger"
            variant="flat"
            onPress={onClose}
          >
            Close
          </Button>
          <Button
            isDisabled={isLoading}
            color="primary"
            // eslint-disable-next-line consistent-return
            onPress={async () => {
              if (!EmailValidator.validate(signInData.email)) return setEmailError(true);
              setEmailError(false);
              if (!signInData.password) return setPasswordError(true);
              setPasswordError(false);

              setIsLoading(true);

              try {
                const res = await AxiosWrapper.post(
                  "http://127.0.0.1:5001/signin",
                  signInData,
                );
                setWrongInfoError(false);
                const accessToken = res.data.access_token;
                Cookies.set("accessToken", accessToken, { expires: 90 });
                // eslint-disable-next-line no-undef
                window.location = "http://localhost:3000/home/projects/";
              } catch (error) {
                if (error.response.status === 401 || error.response.status === 400) {
                  setIsLoading(false);
                  setWrongInfoError(true);
                }
              }
            }}
          >
            Sign In
          </Button>
        </ModalFooter>

      </>
    )
  );
}
