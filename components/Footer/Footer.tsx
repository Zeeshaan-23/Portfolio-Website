import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        {/* Column 1: Contact */}
        <div className={styles.column}>
          <div className={styles.colHeader}>{"// CONTACT"}</div>
          <div className={styles.colContent}>
            <a href="mailto:zeeshaansuhail23@gmail.com" className={styles.link}>
              zeeshaansuhail23@gmail.com
            </a>
          </div>
        </div>

        {/* Column 2: Links */}
        <div className={styles.column}>
          <div className={styles.colHeader}>{"// LINKS"}</div>
          <div className={styles.colContent}>
            <a
              href="https://github.com/Zeeshaan-23"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              [github]
            </a>
            <a
              href="https://www.linkedin.com/in/zeeshaan-suhail"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              [linkedin]
            </a>
          </div>
        </div>

        {/* Column 3: Metadata */}
        <div className={styles.column}>
          <div className={styles.colHeader}>{"// METADATA"}</div>
          <div className={styles.colContent}>
            <div className={styles.metadataLine}>
              {"// Compiled 2026"}
            </div>
            <div className={styles.metadataLine}>
              &gt; find . -name &quot;portfolio&quot; -type digital
            </div>
            <div className={styles.metadataLine}>
              &gt; whoami {"// zeeshaan@portfolio"}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
