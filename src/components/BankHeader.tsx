import griffinLogo from "@/assets/griffin-logo.jpg";

export function BankHeader() {
  return (
    <header className="bank-gradient py-6 px-4 text-center border-b-4 border-bank-gold">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <img 
          src={griffinLogo} 
          alt="Griffin - Account Holder" 
          className="w-12 h-12 rounded-full border-2 border-bank-gold object-cover"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold gold-shimmer">
            One Sec National Bank
          </h1>
          <p className="text-sm text-bank-gold-light italic mt-1">
            "Where every second counts... against you"
          </p>
        </div>
      </div>
    </header>
  );
}
