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
import ProfileIcon from "../Icons/ProfileIcon";

export default function SignUpComponent({ onClose }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordRepeatError, setPasswordRepeatError] = useState(false);
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);

  const getEmailError = () => {
    if (emailError) return "Please Enter a valid email";
    if (userAlreadyExists) return "User with that email already exists";
    return "";
  };

  return (
    (
      <>

        <ModalHeader className="flex flex-col gap-1">Sign Up</ModalHeader>
        <ModalBody>
          <Input
            value={signUpData.firstName}
            onValueChange={(value) => {
              setSignUpData({ ...signUpData, firstName: value });
            }}
            autoFocus
            endContent={
              <ProfileIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
            label="First Name"
            placeholder="Enter your First Name"
            variant="bordered"
            isInvalid={firstNameError}
            errorMessage={firstNameError && "Please Enter a valid first name"}
            isDisabled={isLoading}
          />
          <Input
            value={signUpData.lastName}
            onValueChange={(value) => {
              setSignUpData({ ...signUpData, lastName: value });
            }}
            endContent={
              <ProfileIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
            label="Last Name"
            placeholder="Enter your Last Name"
            variant="bordered"
            isInvalid={lastNameError}
            errorMessage={lastNameError && "Please Enter a valid last name"}
            isDisabled={isLoading}
          />
          <Input
            value={signUpData.email}
            onValueChange={(value) => {
              setSignUpData({ ...signUpData, email: value });
            }}
            endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
            label="Email"
            placeholder="Enter your email"
            variant="bordered"
            isInvalid={emailError || userAlreadyExists}
            errorMessage={getEmailError()}
            isDisabled={isLoading}
          />
          <Input
            value={signUpData.password}
            onValueChange={(value) => {
              setSignUpData({ ...signUpData, password: value });
            }}
            endContent={
              <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
            label="Password"
            placeholder="Enter your password"
            type="password"
            variant="bordered"
            isInvalid={passwordError}
            errorMessage={passwordError && "Please Enter a valid password"}
            isDisabled={isLoading}
          />
          <Input
            value={signUpData.repeatPassword}
            onValueChange={(value) => {
              setSignUpData({ ...signUpData, repeatPassword: value });
            }}
            endContent={
              <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
            label="Password"
            placeholder="Repeat your password"
            type="password"
            variant="bordered"
            isInvalid={passwordRepeatError}
            errorMessage={passwordRepeatError && "The passwords do not match"}
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
              if (!signUpData.firstName) return setFirstNameError(true);
              setFirstNameError(false);
              if (!signUpData.lastName) return setLastNameError(true);
              setLastNameError(false);
              if (!EmailValidator.validate(signUpData.email)) return setEmailError(true);
              setEmailError(false);
              if (!signUpData.password) return setPasswordError(true);
              setPasswordError(false);
              // eslint-disable-next-line max-len
              if (signUpData.password !== signUpData.repeatPassword) return setPasswordRepeatError(true);
              setPasswordRepeatError(false);

              setIsLoading(true);
              try {
                const res = await axios.post(
                  "http://127.0.0.1:8000/signup",
                  signUpData,
                );
                setUserAlreadyExists(false);
                const accessToken = res.data.access_token;
                Cookies.set("accessToken", accessToken, { expires: 90 });
                router.push("/home/projects");
              } catch (error) {
                if (error.response.status === 409) {
                  setIsLoading(false);
                  setUserAlreadyExists(true);
                }
              }
            }}
          >
            Sign Up
          </Button>
        </ModalFooter>

      </>
    )
  );
}
