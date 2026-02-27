const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 pt-16 pb-8 animate-fadeIn">
      <div className="bg-white border-2 border-teal-200 rounded-2xl shadow-2xl shadow-teal-500/20 w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-slideUp my-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-600 border-b-2 border-teal-400 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-teal-100 transition-colors p-2 rounded-lg hover:bg-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 pb-8">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
