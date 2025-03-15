const Footer = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full ">
      <div className="flex items-center justify-center gap-2 pt-10 pb-4 text-white/60 text-sm tracking-wider">
        Made with ❤️ by Developer
        <a href={"https://sahilkumardev.netlify.app"} target="_blank">
          <h2 className="hover:no-underline hover:text-white underline underline-offset-4">
            Sahil Kumar Dev
          </h2>
        </a>
        or
        <a href={"https://buymeacoffee.com/sahilkumar.dev"} target="_blank">
          <h2 className="hover:no-underline hover:text-white underline underline-offset-4">
            buy me a coffee
          </h2>
        </a>
      </div>
    </div>
  );
};

export default Footer;
