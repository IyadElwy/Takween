import {
  Button, ModalHeader, ModalBody, ModalFooter, Input,
} from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import * as EmailValidator from "email-validator";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import MailIcon from "../Icons/Mailcon";
import LockIcon from "../Icons/LockIcon";

export default function SignInComponent({ onClose }) {
  const router = useRouter();

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
            color="default"
            // eslint-disable-next-line consistent-return
            onPress={async () => {
              if (!EmailValidator.validate(signInData.email)) return setEmailError(true);
              setEmailError(false);
              if (!signInData.password) return setPasswordError(true);
              setPasswordError(false);

              setIsLoading(true);

              try {
                const res = await axios.post(
                  "http://127.0.0.1:8000/signin",
                  signInData,
                );
                setWrongInfoError(false);
                const accessToken = res.data.access_token;
                Cookies.set("accessToken", accessToken, { expires: 90 });
                router.push("/home/projects");
              } catch (error) {
                if (error.response.status === 404 || error.response.status === 400) {
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
