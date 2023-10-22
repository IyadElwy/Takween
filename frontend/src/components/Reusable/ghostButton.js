import { Button } from "@nextui-org/react";
import style from "../../styles/components/Reusable/ghostbutton.module.css";

export default function GhostButton({
  customStyle, onPress = () => {}, isDisabled = false, children,
}) {
  return (
    <Button
      isDisabled={isDisabled}
      variant="ghost"
      className={style.ghostButton}
      style={{ ...customStyle }}
      onPress={onPress}
    >
      {children}
    </Button>
  );
}
