import {
  Navbar, NavbarBrand, NavbarContent, Button,
  Modal, ModalContent, useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Logo from "../components/Reusable/logo";
import SignUpComponent from "../components/authentication/signup";
import SignInComponent from "../components/authentication/signin";
import AxiosWrapper from "../utils/axiosWrapper";

export default function Root() {
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin, onOpenChange: onOpenChangeLogin,
  } = useDisclosure();
  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp, onOpenChange: onOpenChangeSignUp,
  } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = (await AxiosWrapper.get("http://127.0.0.1:8000/currentuser")).data;
        if (currentUser) {
          router.push("/home/projects");
        }
      } catch (error) { /* empty */ }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Navbar
        maxWidth="2xl"
        isBordered
        isBlurred
        style={{ backgroundColor: "#3a4158" }}
      >
        <NavbarBrand>
          <Logo spin height={40} width={40} />
          <p className="font-bold text-inherit">Takween</p>

        </NavbarBrand>

        <NavbarContent as="div" justify="end">
          <Button onPress={onOpenLogin} variant="flat" color="primary">Log In</Button>
          <Button onPress={onOpenSignUp} variant="flat" color="primary">Sign Up</Button>
        </NavbarContent>
      </Navbar>
      <div className="flex">
        <div className="w-2/5 p-5">
          <div className="flex justify-center items-center h-full">
            <Logo spin height={200} width={200} />
          </div>
          <div className="flex justify-center items-center">
            <h1 style={{ color: "#3a4158" }} className="text-6xl">Takween</h1>
          </div>
        </div>

        <div className="w-3/5 p-5">
          <div className="flex justify-center items-center">
            <div className="p-4">
              <div className="text-6xl" style={{ color: "#3a4158", marginTop: "50px", marginLeft: "0px" }}>Arabic Text</div>
              <div className="text-5xl" style={{ color: "#3a4158", marginTop: "10px", marginLeft: "40px" }}>Collection</div>
              <div className="text-4xl" style={{ color: "#3a4158", marginTop: "10px", marginLeft: "80px" }}>Processing</div>
              <div className="text-3xl" style={{ color: "#3a4158", marginTop: "10px", marginLeft: "100px" }}>Collaboration</div>
              <div className="text-2xl" style={{ color: "#3a4158", marginTop: "10px", marginLeft: "150px" }}><strong>All under one roof</strong></div>
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
  );
}
