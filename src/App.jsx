import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Schedule from "./components/Schedule.jsx";
import Trainers from "./components/Trainers.jsx";
import Membership from "./components/Membership.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
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
