import './footer.css';

function Footer() {
    return (
        <footer>
            <div className="footer-pipes" aria-hidden="true">
                <span className="footer-pipe footer-pipe-1" />
                <span className="footer-pipe footer-pipe-2" />
                <span className="footer-pipe footer-pipe-3" />
            </div>
            <p>&copy; 2026 <a href="https://redtrowl.com" target="_blank">Redtrowl</a>. All rights reserved.</p>
        </footer>
    )
}

export default Footer;