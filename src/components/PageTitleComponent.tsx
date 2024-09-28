import {
    useEffect,
} from 'react';
import {
    useLocation,
} from 'react-router-dom';

type PageTitleProps = {
    title: string,
}

export const PageTitleComponent = (
    props: PageTitleProps,
): JSX.Element => {
    const location = useLocation();

    useEffect(
        () => {
            document.title = `${props.title} - iOrderBook`;
        },
        [
            location,
            props.title,
        ]
    );

    return (
        <></>
    );
};

export default PageTitleComponent;