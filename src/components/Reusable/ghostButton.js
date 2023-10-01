import { Button } from "@nextui-org/react";
import style from "../../styles/components/ghostbutton.module.css";

export default function GhostButton({ customStyle, text }) {
  return (
    <Button
      variant="ghost"
      className={style.ghostButton}
      style={{ ...customStyle }}
    >
      {text}
    </Button>
  );
}
