import { Button } from "@nextui-org/react";
import style from "../../styles/components/Reusable/ghostbutton.module.css";

export default function GhostButton({ customStyle, onPress = () => {}, children }) {
  return (
    <Button
      variant="ghost"
      className={style.ghostButton}
      style={{ ...customStyle }}
      onPress={onPress}
    >
      {children}
    </Button>
  );
}
