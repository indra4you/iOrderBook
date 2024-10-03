export const FooterComponent = (
): JSX.Element => {
    const currentYear: number = new Date().getFullYear();

    return (
        <footer className="text-center py-5 border-top">
            { currentYear } &copy; iOrder Book - React v18
        </footer>
    );
};

export default FooterComponent;