'use client';
import Home from './sections/Home'
import { Element } from 'react-scroll'
import SecondScroll from './sections/SecondScroll'
import ThirdScroll from './sections/ThirdScroll';

function DownloadPage() {
    return (
        <div>
            <Element name='home'>
                <Home />
            </Element>
            <Element name='secondscroll'>
                <SecondScroll />
            </Element>
            <Element name='thirdscroll'>
                <ThirdScroll />
            </Element>
        </div>
    )
}

export default DownloadPage