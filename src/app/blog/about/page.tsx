import styles from "@/app/ui/styles/about.module.css"
import Image from 'next/image';
import Image1 from "@/app/ui/images/images1.jpg";
import Image2 from "@/app/ui/images/images2.jpg";
import Image3 from "@/app/ui/images/images3.jpg";
import Image4 from "@/app/ui/images/image 4.jpg";


export default function Page() {
  return (
    <>
      {/*  */}
      <div className={styles.container}>
        <h1 className={styles.title}>About Us</h1> 
        <h2 className="heading">
          Welcome to My Blog App!
        </h2>
        <div className={styles.imageContainer}>
        <Image src={Image1} alt="Icon 1"  width={200} height={100} />
        <Image src={Image2} alt="Icon 1" width={200} height={100} />
        <Image src={Image3} alt="Icon 1"  width={200} height={100} />
      </div>
        <p className={styles.description}>
          We’re excited to share our passion for your blog’s main topics, e.g., technology, lifestyle, travel, etc.] with you. Our goal is to provide engaging and informative content that helps you stay updated and inspired.
        </p>
        <h2 className={styles.subTitle}>Our Mission</h2>
        <p className={styles.description}>
          Our mission is to deliver valuable insights and information on main topics. We aim to make complex topics accessible and enjoyable through high-quality articles and resources.
        </p>
        <h2 className={styles.subTitle}>What We Offer</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <img src={Image1.src} alt="Icon 1" className={styles.icon} />
            In-Depth Articles on main topics
          </li>
          <li className={styles.listItem}>
            <img src={Image2.src} alt="Icon 2" className={styles.icon} />
            How-To Guides and Tutorials
          </li>
          <li className={styles.listItem}>
            <img src={Image3.src} alt="Icon 3" className={styles.icon} />
            Reviews and Recommendations
          </li>
          <li className={styles.listItem}>
            <img src={Image4.src} alt="Icon 4" className={styles.icon} />
            Personal Stories and Experiences
          </li>
        </ul>
        <h2 className={styles.subTitle}>Get In Touch</h2>
        <p className={styles.description}>
          We’d love to hear from you! Feel free to reach out via Contact Email or follow us on Social Media Links for updates and more.
        </p>
      </div>
    </>
    )

}