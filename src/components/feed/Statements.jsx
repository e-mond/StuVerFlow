import { Link } from "react-router-dom";

const Statements = () => {
  return (
    <footer className="mt-6 py-4 bg-kiwi-100 text-gray-600 text-sm text-center border-t border-kiwi-200">
      <div className="flex justify-center space-x-4 mb-2">
        <Link to="/about" className="hover:text-kiwi-800 transition">
          About
        </Link>
        <Link to="/terms" className="hover:text-kiwi-800 transition">
          Terms
        </Link>
        <Link to="/privacy" className="hover:text-kiwi-800 transition">
          Privacy
        </Link>
        <Link to="/contact" className="hover:text-kiwi-800 transition">
          Contact
        </Link>
      </div>
      <p>© {new Date().getFullYear()} StuVerFlow. All rights reserved.</p>
    </footer>
  );
};

export default Statements;
