import { ShieldIcon } from '../icons';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1>
          <ShieldIcon size={32} className="header-icon" />
          Post-Quantum Cryptography Status
        </h1>
        <p className="subtitle">
          Track PQC implementation across programming languages and crypto libraries
        </p>
      </div>
    </header>
  );
}

export default Header;

