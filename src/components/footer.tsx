const Footer = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full ">
      <div className="flex items-center justify-center gap-2 pt-10 pb-4 text-white/60 text-sm tracking-wider">
        Developed For You By
        <a href={"https://sahilkumardev.netlify.app"} target="_blank">
          <h2 className="hover:no-underline hover:text-white underline underline-offset-4">
            Sahil Kumar Dev
          </h2>
        </a>
      </div>
    </div>
  );
};

export default Footer;
