import Image from "next/image";
import logo from "../../public/images/ekko-logo.png"; // Change this to the path of your logo file

const EkkoLogo = () => (
  <div>
    <Image src={logo} alt="Ekko Logo" width={121} height={50} />
  </div>
);

export default EkkoLogo;
