import { Icon28Ghost } from "@vkontakte/icons";
import styles from "./lesson-break.module.scss";

export function LessonBreak() {
  return (
    <div className={styles.break__wrapper}>
      <div className={styles.break}>
        <span className={styles.break__text}>Время отдохнуть!</span>
        <Icon28Ghost width={22} fill="#99A2AD" />
      </div>
    </div>
  );
}
