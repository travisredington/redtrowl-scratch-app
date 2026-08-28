import './main-content.css';

function MainContent({ children }: { children: React.ReactNode }) {
    return (
        <main id="main-content-container">
            <div id="main-content">
                { children }
            </div>
        </main>
    )
}

export default MainContent;