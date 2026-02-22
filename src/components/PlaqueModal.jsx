// Modal dialog component for displaying borough details
function PlaqueModal(props) {
    const closeModal = () => props.setIsModalOpen(false);
    return (
        <div className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" style={{border: '4px solid #007cbf', boxShadow: '0 0 0 4px #ffffff, 0 4px 6px rgba(0, 0, 0, 0.1)'}}>
                <div className="flex items-start justify-between">
                <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl">Borough Information</h2>

                <button type="button" className="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none" aria-label="Close" onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                </div>

                <div className="mt-4">
                  <p className="text-pretty text-gray-700">
                    {props.selectedPlaque?.description || 'Select a borough to view more information.'}
                  </p>
                </div>
            </div>
        </div>
    )
}

export default PlaqueModal