import {
  Navbar, NavbarBrand, NavbarContent, Button,
  Modal, ModalContent, useDisclosure,
} from "@nextui-org/react";
import { TypeAnimation } from "react-type-animation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Logo from "../components/Reusable/logo";
import SignUpComponent from "../components/authentication/signup";
import SignInComponent from "../components/authentication/signin";
import AxiosWrapper from "../utils/axiosWrapper";
import LoadingSymbol from "../components/Reusable/loadingSymbol";

export default function Root() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin, onOpenChange: onOpenChangeLogin,
  } = useDisclosure();
  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp, onOpenChange: onOpenChangeSignUp,
  } = useDisclosure();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = (await AxiosWrapper.get("http://127.0.0.1:8000/currentuser")).data;
        if (currentUser) {
          router.push("/home/projects");
        }
      } catch (error) { /* empty */ } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    isLoading ? <LoadingSymbol height={300} width={300} />
      : (
        <>
          <Navbar
            maxWidth="2xl"
            isBordered
            isBlurred
            style={{ backgroundColor: "#3a4158" }}
          >
            <NavbarBrand>
              <Logo spin height={50} width={50} />
              <p className="font-bold text-inherit">MML</p>

            </NavbarBrand>

            <NavbarContent as="div" justify="end">
              <Button onPress={onOpenLogin} variant="faded" color="default">Log In</Button>
              <Button onPress={onOpenSignUp} variant="faded" color="default">Sign Up</Button>
            </NavbarContent>
          </Navbar>
          <div className="flex">
            <div className="w-2/5 p-5">
              <div className="flex justify-center items-center h-full">
                <Logo spin height={350} width={350} />
              </div>
              <div className="flex justify-center items-center">
                <h1 style={{ color: "#3a4158" }} className="text-6xl">Multi-Modal-Lab</h1>
              </div>
            </div>

            <div className="w-3/5 p-5">
              <div className="flex justify-center items-center">
                <div className="p-4">
                  <div className="text-9xl" style={{ color: "#3a4158", marginTop: "50px", marginLeft: "0px" }}>Collect</div>
                  <div className="text-8xl" style={{ color: "#3a4158", marginTop: "20px", marginLeft: "40px" }}>Process</div>
                  <div className="text-5xl" style={{ color: "#3a4158", marginTop: "20px", marginLeft: "80px" }}>Collaborate</div>
                  <div className="text-1xl" style={{ color: "#3a4158", marginTop: "20px", marginLeft: "135px" }}>
                    <TypeAnimation
                      sequence={[
                        // Same substring at the start will only be typed out once, initially
                        "But most importantly",
                        1000, // wait 1s before replacing "Mice" with "Hamsters"
                        "But most importantly Annotate",
                        1000,
                        "and then annotate again",
                        1000,
                        "and again",
                        1000,
                        "and then some more",
                        1000,
                        "until you have enough data :)",
                        1000,
                      ]}
                      wrapper="span"
                      speed={50}
                      style={{ fontSize: "2em", display: "inline-block" }}
                      repeat={2}
                    />

                  </div>

                </div>
              </div>
            </div>
          </div>
          <Modal
            isDismissable={false}
            isOpen={isOpenLogin}
            onOpenChange={onOpenChangeLogin}
            placement="top-center"
            backdrop="blur"
            hideCloseButton
          >
            <ModalContent>
              {(onClose) => (
                <SignInComponent onClose={onClose} />
              )}
            </ModalContent>
          </Modal>
          <Modal
            isDismissable={false}
            isOpen={isOpenSignUp}
            onOpenChange={onOpenChangeSignUp}
            placement="top-center"
            backdrop="blur"
            hideCloseButton
          >
            <ModalContent>
              {(onClose) => (
                <SignUpComponent onClose={onClose} />
              )}
            </ModalContent>
          </Modal>
        </>
      )
  );
}
