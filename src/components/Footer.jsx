const Footer = () => {
  return (
    <footer className="w-full bg-slate-200 border-t-[1px] border-slate-900 flex px-8 py-4 justify-center items-center">
      <p className="text-slate-700 text-sm">
        &copy; {new Date().getFullYear()} Self Learner. All Rights Reserved.
      </p>
    </footer>
  );
};
export default Footer;
