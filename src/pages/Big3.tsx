import Big3Visualizations from "../components/big3-visualizations/big3-visualizations";
import MainContent from "../components/ui/main-content/main-content";

function Big3Page () {
    return (
        <MainContent>
            <h2>Results of the Big 3</h2>

            <h3>These are the results of a public survey I posted on Google to gather insights from 3 categories:</h3>

            <p>There is the Big 5 test for personality bend, political leaning, and how you identify your sexual orientation. Let's see how they stack up.</p>

            <Big3Visualizations />
        </MainContent>
    )
}

export default Big3Page;