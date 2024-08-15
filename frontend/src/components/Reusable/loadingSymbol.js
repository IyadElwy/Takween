import Image from "next/image";
import styles from "../../styles/components/Reusable/logo.module.css";

export default function LoadingSymbol({
  height, width, style = {},
}) {
  return (
    <div className={styles.centerDivLogoSpin}>
      <Image
        priority
        style={style}
        className={styles.loadingLogoSpin}
        src="/images/takween_logo.svg"
        height={height}
        width={width}
        alt="Logo"
      />

    </div>
  );
}
