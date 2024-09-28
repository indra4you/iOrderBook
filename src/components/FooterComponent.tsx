export const FooterComponent = (
): JSX.Element => {
    const currentYear: number = new Date().getFullYear();

    return (
        <footer className="text-center mt-5 py-5 border-top">
            { currentYear } &copy; iOrder Book
        </footer>
    );
};

export default FooterComponent;