const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Muhammad Abdullah</strong> • Student ID: 32147000
            </p>
            <p className="text-sm text-muted-foreground">
              Supervised by <strong className="text-foreground">Dr. Imtias Ahmed</strong>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">University of West London - RAK Campus</p>
              <p className="text-xs text-muted-foreground">Final Year Computer Science Project</p>
            </div>
            {/* Logo placeholder */}
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border border-border">
              <span className="text-xs text-muted-foreground text-center">UWL RAK</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 AI-Powered Career Counselor. This is a research project. All data is processed anonymously.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
