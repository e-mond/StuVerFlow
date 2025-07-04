import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const modalContent = {
  about: {
    title: "About StuVerFlow",
    description: `
StuVerFlow is a platform built to connect university students through collaboration, mentorship, and knowledge sharing. 
Launched in 2025, our goal is to nurture an inclusive, supportive academic and professional community.`,
  },
  terms: {
    title: "Terms of Use",
    description: `
By using StuVerFlow, you agree to engage respectfully, avoid spam, and contribute meaningfully. 
Violations may result in temporary or permanent suspension of access.`,
  },
  privacy: {
    title: "Privacy Policy",
    description: `
Your privacy is our priority. We never share your personal data with third parties. 
You remain in control of your account and information at all times.`,
  },
  support: {
    title: "Support",
    description: `
Need help or have questions? Reach out to us at 
📧: support@stuverflow.com`,
  },
  accessibility: {
    title: "Accessibility",
    description: `
We are committed to making StuVerFlow usable and accessible to everyone. 
If you encounter any accessibility issues or have suggestions to improve the experience, please let us know.`,
  },
};

const Statements = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (key) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  return (
    <footer
      role="contentinfo"
      className="py-2 px-2 bg-kiwi-500 text-white text-sm text-center border border-kiwi-600 rounded-lg shadow-md"
    >
      <nav
        aria-label="Footer navigation"
        className="flex justify-center flex-wrap gap-2 mb-2"
      >
        {Object.entries(modalContent).map(([key, value]) => (
          <button
            key={key}
            onClick={() => openModal(key)}
            className="hover:underline transition focus:outline-none focus-visible:ring focus-visible:ring-kiwi-300 rounded"
            aria-label={`Open ${value.title}`}
          >
            {value.title.split(" ")[0]}
          </button>
        ))}
      </nav>
      <p className="text-xs text-white/90">
        © {new Date().getFullYear()} StuVerFlow. All rights reserved.
      </p>

      <Transition appear show={!!activeModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white max-w-md w-full p-6 rounded-xl shadow-xl focus:outline-none">
                <Dialog.Title className="text-lg font-bold mb-3 text-kiwi-700">
                  {modalContent[activeModal]?.title}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-800 whitespace-pre-line">
                  {modalContent[activeModal]?.description.includes(
                    "support@stuverflow.com",
                  ) ? (
                    <>
                      Need help or have questions? Reach out to us at
                      <br />
                      📧:{" "}
                      <a
                        href="mailto:support@stuverflow.com"
                        className="text-kiwi-700 underline"
                      >
                        support@stuverflow.com
                      </a>
                    </>
                  ) : (
                    modalContent[activeModal]?.description
                  )}
                </Dialog.Description>
                <div className="mt-5 text-right">
                  <button
                    onClick={closeModal}
                    className="px-4 py-1 text-sm rounded bg-kiwi-700 text-white hover:bg-kiwi-800 transition focus:outline-none focus-visible:ring"
                    aria-label="Close modal"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </footer>
  );
};

export default Statements;
