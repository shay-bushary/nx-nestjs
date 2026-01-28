import { Link } from "react-router";
import styles from "./MainMenu.module.css";

export function MainMenu() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hangman</h1>
      <div className={styles.buttonGroup}>
        <Link to="/hangman/single" className="btn btn-primary">
          Single Player
        </Link>
        <Link to="/hangman/two-player/setup" className="btn btn-primary">
          Two Player
        </Link>
      </div>
    </div>
  );
}
