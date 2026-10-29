import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Schedule from "./components/Schedule.jsx";
import Trainers from "./components/Trainers.jsx";
import Membership from "./components/Membership.jsx";
import Footer from "./components/Footer.jsx";
import CheckoutSuccess from "./components/CheckoutSuccess.jsx";

export default function App() {
    // No router: the one extra page is Stripe's return address.
    if (window.location.pathname === "/checkout/success") {
        return (
            <>
                <Header />
                <main>
                    <CheckoutSuccess />
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main>
                <Hero />
                <Schedule />
                <Trainers />
                <Membership />
            </main>
            <Footer />
        </>
    );
}
