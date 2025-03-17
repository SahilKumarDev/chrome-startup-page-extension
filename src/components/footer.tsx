const Footer = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 pt-10 pb-4 text-white/60 text-sm tracking-wider text-nowrap ">
        Made with ❤️ by Developer
        <span className="flex gap-x-2">
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
        </span>
      </div>
    </div>
  );
};

export default Footer;
