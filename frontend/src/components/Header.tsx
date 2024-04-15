
import { useAppContext } from '../contexts/AppContext';
import SignOutButton from './SignOutButton';
import Modal from 'react-modal';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { currencyData } from '../config/currency';

const Header = () => {
    const { role, isLogin } = useAppContext();
    const customStyles: Modal.Styles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    Modal.setAppElement('#root');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [currency, setCurrency] = useState<string>(() =>
        sessionStorage.getItem("currency") || 'USD'
    );

    const openModal = () => {
        setIsOpen(true);
    };

    const afterOpenModal = () => {
        // if (subtitle) {
        //     subtitle.style.color = '#f00';
        // }
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const selectCurrency = (currencyCode: string) => {
        setIsOpen(false);
        setCurrency(currencyCode);
        sessionStorage.setItem("currency", currencyCode);

    };
    return (
        <div className="bg-blue-800 py-3">
            <div className="container flex mx-auto justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/"> Checkin.com</Link>
                </span>
                <span className="flex space-x-2">

                    <button
                        onClick={openModal}
                        className='flex items-center text-white px-3 font-bold hover:bg-blue-600 rounded'
                    >
                        {currency}
                    </button>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        <div className='flex justify-between'>
                            <h2 className='text-2xl font-bold mb-3'>Select your currency</h2>
                            <button
                                onClick={closeModal}
                            >
                                <X />
                            </button>
                        </div>
                        <div>
                            <ul className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-2">
                                {Object.keys(currencyData).map((currencyCode: string) => (
                                    <li
                                        key={currencyCode}
                                        className={`m-2 rounded p-2 ${currency === currencyCode ? 'bg-blue-50 text-blue-600' : ''}`}


                                        onClick={() => selectCurrency(currencyCode)}
                                    >
                                        <div>
                                            <div>{currencyData[currencyCode as keyof typeof currencyData].name}</div>
                                            <div>{currencyCode}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Modal>

                    {isLogin ? (
                        <>
                            <Link
                                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                                to="/my-bookings"
                            >
                                My Bookings
                            </Link>
                            {role === 'business' && (
                                <Link
                                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                                    to="/my-hotels"
                                >
                                    My Hotels
                                </Link>
                            )}
                            <SignOutButton />

                        </>
                    ) : (
                        <Link
                            to="/sign-in"
                            className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100 rounded-sm"
                        >
                            Sign in
                        </Link>
                    )}
                </span>
            </div>
        </div>

    )
}

export default Header;