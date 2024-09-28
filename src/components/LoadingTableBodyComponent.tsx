type LoadingTableBodyProps = {
    noOfRows: number,
    noOfColumns: number,
};

export const LoadingTableBodyComponent = (
    props: LoadingTableBodyProps,
): JSX.Element => {
    const tds: JSX.Element[] = [...Array(props.noOfColumns).keys()]
        .map(
            (_, index) => {
                return (
                    <td key={index} scope="row">
                        <div className="placeholder-glow">
                            <div className="col-12 placeholder placeholder-sm"></div>
                        </div>
                    </td>
                )
            }
        );

    const trs: JSX.Element[] = [...Array(props.noOfRows).keys()]
        .map(
            (_, index) => {
                return (
                    <tr key={index}>
                        { tds }
                    </tr>
                )
            }
        );

    return (
        <>
            { trs }
        </>
    );
};

export default LoadingTableBodyComponent;