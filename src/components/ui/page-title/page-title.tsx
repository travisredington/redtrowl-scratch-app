import './page-title.css';

interface PageTitleProps {
    pageTitle: string;
}

function PageTitle({pageTitle}: PageTitleProps) {
    return (
        <div id="page-title">
            <svg
                className="skyline"
                aria-hidden="true"
                viewBox="0 0 1000 85"
                preserveAspectRatio="none"
            >
                <polyline className="pipe pipe-1" points="0,85 0,58 40,58 40,42 110,42 110,68 160,68 160,50 220,50 220,64 275,64 275,42 375,42" />
                <polyline className="pipe pipe-1" points="625,42 715,42 715,66 770,66 770,48 830,48 830,60 880,60 880,40 945,40 945,56 1000,56 1000,85" />
                <polyline className="pipe pipe-2" points="0,85 0,64 60,64 60,48 130,48 130,70 185,70 185,54 250,54 250,66 310,66 310,46 377,46" />
                <polyline className="pipe pipe-2" points="623,46 695,46 695,68 750,68 750,46 810,46 810,62 875,62 875,44 930,44 930,60 1000,60 1000,85" />
                <polyline className="pipe pipe-3" points="0,85 0,70 50,70 50,58 95,58 95,72 150,72 150,60 200,60 200,68 260,68 260,56 315,56 315,50 379,50" />
                <polyline className="pipe pipe-3" points="621,50 685,50 685,58 740,58 740,68 800,68 800,56 850,56 850,70 905,70 905,58 950,58 950,70 1000,70 1000,85" />
                <path className="frame frame-1" d="M 375 42 L 375 15 L 625 15 L 625 42" />
                <path className="frame frame-2" d="M 377 46 L 377 17 L 623 17 L 623 46" />
                <path className="frame frame-3" d="M 379 50 L 379 19 L 621 19 L 621 50" />
            </svg>
            <h2>{pageTitle}</h2>
        </div>
    )
}

export default PageTitle;